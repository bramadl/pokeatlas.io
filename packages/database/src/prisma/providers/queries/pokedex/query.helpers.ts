import { prisma } from "@prisma-client";
import type { FormCategory } from "@prisma-client/enums";
import type { PokemonFormModelGetPayload } from "@prisma-client/models";

interface SearchToken {
	type: "name" | "dex" | "family";
	value: string;
}

export function getFormPriority(
	form: PokemonFormModelGetPayload<{ include: { species: true } }>,
): number {
	const { formCategory, isDefaultForm, isFemale } = form;

	if (isDefaultForm && formCategory === "BASE_FORM") return 0;

	switch (formCategory) {
		case "BASE_FORM":
			return isFemale ? 1 : 0;

		case "ALTERNATE_FORM":
			return isFemale ? 3 : 2;

		case "REGIONAL_VARIANT":
			return isFemale ? 4 : 3;

		case "TEMPORARY_EVOLUTION_FORM":
			return 4;

		case "COSTUME_VARIANT":
			return isFemale ? 6 : 5;

		default:
			return 9;
	}
}

export function parseSearchTokens(search: string): SearchToken[] {
	return search
		.split(",")
		.map((t) => t.trim())
		.filter(Boolean)
		.map((term) => {
			if (term.startsWith("+")) {
				return { type: "family", value: term.slice(1).trim() };
			}
			const asNumber = parseInt(term, 10);
			if (!Number.isNaN(asNumber)) {
				return { type: "dex", value: term };
			}
			return { type: "name", value: term };
		});
}

export function projectionCategoryToFormFilter(
	category: string | null,
): "alternate" | "costume" | "regional" | "temporary_evolution" | null {
	switch (category) {
		case "ALTERNATE_FORM":
			return "alternate";
		case "COSTUME_VARIANT":
			return "costume";
		case "REGIONAL_VARIANT":
			return "regional";
		case "TEMPORARY_EVOLUTION_FORM":
			return "temporary_evolution";
		default:
			return null;
	}
}

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

export function toProjectionFormCategory(
	formCategory: FormCategory,
): string | null {
	switch (formCategory) {
		case "BASE_FORM":
			return null;
		case "ALTERNATE_FORM":
			return "ALTERNATE_FORM";
		case "COSTUME_VARIANT":
			return "COSTUME_VARIANT";
		case "REGIONAL_VARIANT":
			return "REGIONAL_VARIANT";
		case "TEMPORARY_EVOLUTION_FORM":
			return "TEMPORARY_EVOLUTION_FORM";
		default:
			return null;
	}
}
