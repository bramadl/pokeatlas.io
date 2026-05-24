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
		search,
		trainerId,
		page = 1,
		limit = 60,
	}: BrowsePokedexInput): Promise<BrowsePokedexOutput> {
		const safePage = Math.max(1, page);
		const whereCondition: PokedexProjectionWhereInput = {
			trainerRef: trainerId,
		};

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
				whereCondition.OR = searchConditions;
			}
		}

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
					| "alternate"
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
