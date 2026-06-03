import type { BrowsePokedexInput } from "@context/collection";

import { prisma } from "#prisma-client";
import type { PokemonModelWhereInput } from "#prisma-client/models.ts";

export type SearchToken =
	| { type: "name"; value: string }
	| { type: "dex"; value: number }
	| { type: "family"; value: string };

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

export async function resolveFamilyDexNumbers(
	terms: string[],
): Promise<number[]> {
	if (terms.length === 0) return [];

	const matchedFamilies = await prisma.pokemonModel.findMany({
		distinct: ["familyId"],
		select: { familyId: true },
		where: {
			OR: terms.map((t) => ({
				speciesName: { contains: t, mode: "insensitive" as const },
			})),
		},
	});

	const familyIds = matchedFamilies.map((p) => p.familyId);
	if (familyIds.length === 0) return [];

	const familyMembers = await prisma.pokemonModel.findMany({
		distinct: ["pokedexNumber"],
		select: { pokedexNumber: true },
		where: { familyId: { in: familyIds } },
	});

	return familyMembers.map((p) => p.pokedexNumber);
}

export async function searchFilter(
	search?: NonNullable<BrowsePokedexInput["filters"]>["search"],
): Promise<PokemonModelWhereInput | null> {
	if (search?.trim()) {
		const tokens = parseSearchTokens(search);
		const searchConditions: PokemonModelWhereInput[] = [];

		const familyTerms = tokens
			.filter(
				(t): t is { type: "family"; value: string } => t.type === "family",
			)
			.map((t) => t.value);

		if (familyTerms.length) {
			const dexNumbers = await resolveFamilyDexNumbers(familyTerms);
			searchConditions.push(
				dexNumbers.length
					? { pokedexNumber: { in: dexNumbers } }
					: { ref: "__no_match__" },
			);
		}

		for (const token of tokens) {
			if (token.type === "dex") {
				searchConditions.push({ pokedexNumber: token.value });
			} else if (token.type === "name") {
				searchConditions.push({
					OR: [
						{ formName: { contains: token.value, mode: "insensitive" } },
						{ speciesName: { contains: token.value, mode: "insensitive" } },
					],
				});
			}
		}

		if (searchConditions.length) {
			return { OR: searchConditions };
		}
	}

	return null;
}
