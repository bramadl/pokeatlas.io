import { prisma } from "@prisma-client";

export async function resolveFamilyDexNumbers(
	terms: string[],
): Promise<number[]> {
	if (terms.length === 0) return [];

	const matchedSpecies = await prisma.pokemonSpeciesModel.findMany({
		select: { familyId: true },
		where: {
			OR: terms.map((t) => ({
				name: { mode: "insensitive" as const, startsWith: t },
			})),
		},
	});

	const familyIds = [...new Set(matchedSpecies.map((s) => s.familyId))];
	if (familyIds.length === 0) return [];

	const family = await prisma.pokemonSpeciesModel.findMany({
		select: { pokedexNumber: true },
		where: { familyId: { in: familyIds } },
	});

	return [...new Set(family.map((s) => s.pokedexNumber))];
}
