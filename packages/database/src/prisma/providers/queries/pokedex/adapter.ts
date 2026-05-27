import type {
	BrowsePokedexInput,
	BrowsePokedexOutput,
	IPokedexService,
} from "@context/collection/types";

import { prisma } from "#prisma-client";
import type { PokedexProjectionWhereInput } from "#prisma-client/models";

import { REGION_DEX_RANGES } from "../../constants/region-dex-ranges";
import { REGIONAL_ORIGIN_SUFFIXES } from "../../constants/regional-origin-suffixes";
import { parseSearchTokens, resolveFamilyDexNumbers } from "./adapter.helpers";
import { toProjection } from "./adapter.mapper";

export class PrismaPokedexServiceAdapter implements IPokedexService {
	public async browse({
		dex,
		trainerId,
		filters,
		pagination: { limit, page },
	}: BrowsePokedexInput): Promise<BrowsePokedexOutput> {
		const safePage = Math.max(1, page);
		const andConditions: PokedexProjectionWhereInput[] = [
			{ trainerRef: trainerId },
		];

		if (dex && dex !== "NATIONAL") {
			const range = REGION_DEX_RANGES[dex];
			const suffix = REGIONAL_ORIGIN_SUFFIXES[dex];

			if (dex === "HISUI") {
				andConditions.push({ form: { contains: "HISUIAN" } });
			} else if (suffix) {
				if (range) {
					const [min, max] = range;
					andConditions.push({
						OR: [
							{
								dexNumber: { gte: min, lte: max },
								formCategory: { not: "REGIONAL_FORM" },
							},
							{ form: { contains: suffix } },
						],
					});
				}
			} else {
				if (range) {
					const [min, max] = range;
					andConditions.push({
						dexNumber: { gte: min, lte: max },
						formCategory: { not: "REGIONAL_FORM" },
					});
				}
			}
		}

		if (filters) {
			// ── Classification filter ───────────────────────────────────────────────

			const classification = filters?.classification;
			if (classification && classification.length > 0) {
				const enumValues = classification.filter((c) => c !== "STANDARD");
				const includeNormal = classification.includes("STANDARD");

				if (enumValues.length > 0 && includeNormal) {
					andConditions.push({
						OR: [
							{ classification: { in: enumValues } },
							{ classification: null },
						],
					});
				} else if (enumValues.length > 0) {
					andConditions.push({ classification: { in: enumValues } });
				} else {
					andConditions.push({ classification: null });
				}
			}

			// ── Search ──────────────────────────────────────────────────────────────

			const search = filters.search;
			if (search && search.trim() !== "") {
				const tokens = parseSearchTokens(search);
				const searchConditions: PokedexProjectionWhereInput[] = [];

				const familyTerms = tokens
					.filter(
						(t): t is Extract<typeof t, { type: "family" }> =>
							t.type === "family",
					)
					.map((t) => t.value);

				if (familyTerms.length > 0) {
					const dexNumbers = await resolveFamilyDexNumbers(
						familyTerms,
						trainerId,
					);

					if (dexNumbers.length > 0) {
						searchConditions.push({ dexNumber: { in: dexNumbers } });
					} else {
						searchConditions.push({ pokemonRef: "__no_match__" });
					}
				}

				for (const token of tokens) {
					if (token.type === "dex") {
						searchConditions.push({ dexNumber: token.value });
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

			// ── Status filter ───────────────────────────────────────────────────────

			const status = filters.status;
			if (status) {
				if (status === "MISSING") {
					andConditions.push({ trackedStates: { equals: [] } });
				} else if (status === "TRACKED") {
					andConditions.push({ trackedStates: { isEmpty: false } });
				}
			}

			// ── Types filter ────────────────────────────────────────────────────────

			const types = filters.types;
			if (types && types.length > 0) {
				const formattedTypes = types.map(
					(t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase(),
				);

				if (formattedTypes.length === 1) {
					const type = formattedTypes[0];
					andConditions.push({
						OR: [{ primaryType: type }, { secondaryType: type }],
					});
				} else if (formattedTypes.length === 2) {
					const [typeA, typeB] = formattedTypes;
					andConditions.push({
						OR: [
							{ AND: [{ primaryType: typeA }, { secondaryType: typeB }] },
							{ AND: [{ primaryType: typeB }, { secondaryType: typeA }] },
						],
					});
				}
			}
		}

		// ── Variant filters ───────────────────────────────────────────────────────

		const {
			alternateForm = false,
			costume = false,
			gender = false,
			temporaryEvolution = false,
		} = filters?.variants ?? {};

		if (!alternateForm) {
			andConditions.push({
				OR: [{ formCategory: { not: "ALTERNATE_FORM" } }, { isCostume: true }],
			});
		}

		if (!costume) andConditions.push({ isCostume: false });
		if (!gender) andConditions.push({ isFemale: false });

		if (!temporaryEvolution) {
			andConditions.push({ isTemporaryEvolution: false });
		}

		// ── Build where ───────────────────────────────────────────────────────────

		const whereCondition: PokedexProjectionWhereInput =
			andConditions.length === 1
				? (andConditions[0] as PokedexProjectionWhereInput)
				: { AND: andConditions };

		// ── Query ─────────────────────────────────────────────────────────────────

		const [totalEntries, trainerPokedex] = await Promise.all([
			prisma.pokedexProjection.count({
				where: whereCondition,
			}),

			prisma.pokedexProjection.findMany({
				orderBy: [
					{ sortGroup: "asc" },
					{ dexNumber: "asc" },
					{ formPriority: "asc" },
					{ pokemonName: "asc" },
				],
				skip: (safePage - 1) * limit,
				take: limit,
				where: whereCondition,
			}),
		]);

		return {
			entries: trainerPokedex.map(toProjection),
			hasMore: safePage * limit < totalEntries,
			totalEntries,
		};
	}
}
