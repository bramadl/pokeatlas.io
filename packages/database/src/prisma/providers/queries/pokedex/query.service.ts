import type {
	BrowsePokedexInput,
	BrowsePokedexOutput,
	IPokedexQueryService,
	PokedexRegion,
} from "@context/collection";
import { PokemonRef } from "@context/shared";
import { prisma } from "@prisma-client";
import type { PokedexProjectionWhereInput } from "@prisma-client/models";
import {
	parseSearchTokens,
	projectionCategoryToFormFilter,
	resolveFamilyDexNumbers,
} from "./query.helpers";

// ─── Region → dex number ranges ──────────────────────────────────────────────

const REGION_DEX_RANGES: Record<PokedexRegion, [number, number]> = {
	alola: [722, 809], // includes Meltan (808) and Melmetal (809)
	galar: [810, 898],
	hisui: [899, 905],
	hoenn: [252, 386],
	johto: [152, 251],
	kalos: [650, 721],
	kanto: [1, 151],
	paldea: [906, 1025],
	sinnoh: [387, 493],
	unova: [494, 649],
};

// ─── FormCategory string → filter value ──────────────────────────────────────

const FORM_FILTER_TO_PROJECTION: Record<string, string> = {
	alternate: "ALTERNATE_FORM",
	costume: "COSTUME_VARIANT",
	regional: "REGIONAL_VARIANT",
	temporary_evolution: "TEMPORARY_EVOLUTION_FORM",
};

// ─── Service ──────────────────────────────────────────────────────────────────

export class PrismaPokedexQueryService implements IPokedexQueryService {
	public async browsePokedex({
		form,
		regions,
		status,
		search,
		trainerId,
		types,
		variants,
		page = 1,
		limit = 60,
	}: BrowsePokedexInput): Promise<BrowsePokedexOutput> {
		const safePage = Math.max(1, page);

		// ── Top-level AND conditions — each filter is independent ─────────────────
		const andConditions: PokedexProjectionWhereInput[] = [
			{ trainerRef: trainerId },
		];

		// ── Search Filter ─────────────────────────────────────────────────────────
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

		// ── Status Filter ─────────────────────────────────────────────────────────

		if (status === "missing") {
			andConditions.push({ trackedStates: { equals: [] } });
		} else if (status === "tracked") {
			andConditions.push({ trackedStates: { isEmpty: false } });
		}

		// ── Form filter ───────────────────────────────────────────────────────────
		if (form) {
			const projectionCategory = FORM_FILTER_TO_PROJECTION[form];
			if (projectionCategory) {
				andConditions.push({ formCategory: projectionCategory });
			}
		}

		// ── Variant filters ───────────────────────────────────────────────────────
		const excludeConditions: PokedexProjectionWhereInput[] = [];
		if (variants?.regional === false) {
			excludeConditions.push({ formCategory: { not: "REGIONAL_VARIANT" } });
		}

		if (variants?.gender === false) excludeConditions.push({ isFemale: false });
		if (variants?.costume !== true) {
			excludeConditions.push({ formCategory: { not: "COSTUME_VARIANT" } });
		}

		for (const c of excludeConditions) {
			andConditions.push(c);
		}

		// ── Region filter ─────────────────────────────────────────────────────────
		if (regions && regions.length > 0) {
			const regionConditions: PokedexProjectionWhereInput[] = regions.map(
				(region) => {
					const [min, max] = REGION_DEX_RANGES[region] as [number, number];
					return { dexNumber: { gte: min, lte: max } };
				},
			);

			andConditions.push(
				regionConditions.length === 1
					? (regionConditions[0] as PokedexProjectionWhereInput)
					: { OR: regionConditions },
			);
		}

		// ── Types ─────────────────────────────────────────────────────────────────
		if (types && types.length > 0) {
			for (const type of types) {
				const titleCase =
					type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();

				andConditions.push({
					OR: [{ primaryType: titleCase }, { secondaryType: titleCase }],
				});
			}
		}

		// ── Build final conditions ────────────────────────────────────────────────
		const whereCondition: PokedexProjectionWhereInput =
			andConditions.length === 1
				? (andConditions[0] as PokedexProjectionWhereInput)
				: { AND: andConditions };

		// ── Query ─────────────────────────────────────────────────────────────────
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
				form: projectionCategoryToFormFilter(entry.formCategory),
				id: PokemonRef.from(entry.pokemonRef),
				isFemale: entry.isFemale,
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
