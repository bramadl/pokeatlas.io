import type {
	BrowsePokedexInput,
	BrowsePokedexOutput,
	IPokedexQueryService,
} from "@context/collection";
import { PokemonRef } from "@context/shared";
import { parseSearchTokens } from "@prisma/utils/parse-search-token";
import { resolveFamilyDexNumbers } from "@prisma/utils/resolve-family-dex-number";
import { prisma } from "@prisma-client";
import type { PokedexProjectionWhereInput } from "@prisma-client/models";

export class PrismaPokedexQueryService implements IPokedexQueryService {
	public async browsePokedex({
		form,
		status,
		search,
		trainerId,
		types,
		page = 1,
		limit = 60,
	}: BrowsePokedexInput): Promise<BrowsePokedexOutput> {
		const safePage = Math.max(1, page);

		// Top-level AND conditions — each filter is independent
		const andConditions: PokedexProjectionWhereInput[] = [
			{ trainerRef: trainerId },
		];

		// ── Search ──────────────────────────────────────────────────────────────
		if (search && search.trim() !== "") {
			const tokens = parseSearchTokens(search);
			const searchConditions: PokedexProjectionWhereInput[] = [];

			const familyTerms = tokens
				.filter((t) => t.type === "family")
				.map((t) => t.value);

			if (familyTerms.length > 0) {
				const dexNumbers = await resolveFamilyDexNumbers(familyTerms);
				if (dexNumbers.length > 0) {
					searchConditions.push({ dexNumber: { in: dexNumbers } });
				} else {
					searchConditions.push({ pokemonRef: "__no_match__" });
				}
			}

			for (const token of tokens.filter((t) => t.type !== "family")) {
				if (token.type === "dex") {
					searchConditions.push({ dexNumber: parseInt(token.value, 10) });
				} else if (token.type === "name") {
					searchConditions.push({
						pokemonName: { contains: token.value, mode: "insensitive" },
					});
				}
			}

			if (searchConditions.length > 0) {
				andConditions.push({ OR: searchConditions });
			}
		}

		// ── Status ──────────────────────────────────────────────────────────────
		if (status === "missing") {
			andConditions.push({ trackedStates: { equals: [] } });
		} else if (status === "caught") {
			andConditions.push({ trackedStates: { isEmpty: false } });
		}

		// ── Form ────────────────────────────────────────────────────────────────
		if (form) {
			andConditions.push({ formCategory: form });
		}

		// ── Types ───────────────────────────────────────────────────────────────
		if (types && types.length > 0) {
			for (const type of types) {
				const titleCase =
					type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();

				andConditions.push({
					OR: [{ primaryType: titleCase }, { secondaryType: titleCase }],
				});
			}
		}

		// ── Build final where ───────────────────────────────────────────────────
		const whereCondition: PokedexProjectionWhereInput =
			andConditions.length === 1
				? (andConditions[0] as PokedexProjectionWhereInput)
				: { AND: andConditions };

		// ── Query ───────────────────────────────────────────────────────────────
		const totalEntries = await prisma.pokedexProjection.count({
			where: whereCondition,
		});

		const trainerPokedex = await prisma.pokedexProjection.findMany({
			orderBy: [
				{ dexNumber: "asc" },
				{ formPriority: "asc" },
				{ pokemonName: "asc" },
			],
			skip: (safePage - 1) * limit,
			take: limit,
			where: whereCondition,
		});

		return {
			entries: trainerPokedex.map((entry) => ({
				dex: entry.dexNumber,
				form: entry.formCategory as
					| "costume"
					| "regional"
					| "female"
					| "mega"
					| null,
				id: PokemonRef.from(entry.pokemonRef),
				lastModifiedAt: entry.updatedAt,
				name: entry.pokemonName,
				sprites: { shinyUrl: entry.shinyImageUrl, url: entry.imageUrl },
				trackedStates: entry.trackedStates,
				types: [entry.primaryType, entry.secondaryType].filter(
					Boolean,
				) as string[],
			})),
			hasMore: safePage * limit < totalEntries,
			totalEntries,
		};
	}
}
