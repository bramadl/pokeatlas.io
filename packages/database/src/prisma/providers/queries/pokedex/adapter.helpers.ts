import { prisma } from "#prisma-client";

export type SearchToken =
	| { type: "name"; value: string }
	| { type: "dex"; value: number }
	| { type: "family"; value: string };

/**
 * Parses a comma-separated search string into typed tokens.
 *
 * Rules per term:
 *   +bulbasaur  → family search (resolves all Bulbasaur evolution line)
 *   025         → dex number search
 *   pikachu     → name search (case-insensitive contains)
 *
 * Example: "pikachu, 002, +charizard"
 *   → [name:pikachu, dex:2, family:charizard]
 */
export function parseSearchTokens(search: string): SearchToken[] {
	return search
		.split(",")
		.map((t) => t.trim())
		.filter(Boolean)
		.map((term): SearchToken => {
			if (term.startsWith("+")) {
				return { type: "family", value: term.slice(1).trim().toLowerCase() };
			}
			const asNumber = parseInt(term, 10);
			if (!Number.isNaN(asNumber) && asNumber > 0) {
				return { type: "dex", value: asNumber };
			}
			return { type: "name", value: term.toLowerCase() };
		});
}

/**
 * Given a list of family search terms (e.g. ["charizard", "bulbasaur"]),
 * resolves all dex numbers that belong to those evolutionary families.
 *
 * Strategy:
 *   1. Find species whose name starts with the term (case-insensitive).
 *   2. Collect their familyIds.
 *   3. Return all dex numbers that share those familyIds.
 */
export async function resolveFamilyDexNumbers(
	terms: string[],
	trainerId: string,
): Promise<number[]> {
	if (terms.length === 0) return [];

	const matchedFamilies = await prisma.pokedexProjection.findMany({
		distinct: ["familyId"],
		select: { familyId: true },
		where: {
			OR: terms.map((t) => ({
				pokemonName: { contains: t, mode: "insensitive" as const },
			})),
			trainerRef: trainerId,
		},
	});

	const familyIds = matchedFamilies.map((s) => s.familyId);
	if (familyIds.length === 0) return [];

	const familyMembers = await prisma.pokedexProjection.findMany({
		distinct: ["dexNumber"],
		select: { dexNumber: true },
		where: {
			familyId: { in: familyIds },
			trainerRef: trainerId,
		},
	});

	return familyMembers.map((s) => s.dexNumber);
}
