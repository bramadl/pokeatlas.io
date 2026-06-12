import type { BrowsePokedexInput } from "@context/collection";
import {
	POKEDEX_REGIONAL_RANGES,
	POKEMON_REGIONAL_ORIGIN_SUFFIX,
	type PokemonRegional,
} from "@context/game";

import type { PokemonModelWhereInput } from "#prisma-client/models";

export function pokedexFilter(
	pokedex: NonNullable<BrowsePokedexInput["filters"]>["pokedex"],
): PokemonModelWhereInput | null {
	if (pokedex && pokedex !== "NATIONAL") {
		const suffix = POKEMON_REGIONAL_ORIGIN_SUFFIX[pokedex as PokemonRegional];
		const range =
			POKEDEX_REGIONAL_RANGES[
				pokedex as unknown as keyof typeof POKEDEX_REGIONAL_RANGES
			];

		if (pokedex === "HISUI") {
			const conditions: PokemonModelWhereInput[] = [
				{ ref: { contains: "HISUIAN" } },
			];
			if (range) {
				const [min, max] = range;
				conditions.push({
					formCategory: { not: "REGIONAL_FORM" },
					pokedexNumber: { gte: min, lte: max },
				});
			}
			return conditions.length === 1
				? (conditions[0] as PokemonModelWhereInput)
				: { OR: conditions };
		}

		if (suffix && range) {
			const [min, max] = range;
			return {
				OR: [
					{
						formCategory: { not: "REGIONAL_FORM" },
						pokedexNumber: { gte: min, lte: max },
					},
					{ ref: { contains: suffix } },
				],
			};
		}

		if (suffix) return { ref: { contains: suffix } };
		if (range) {
			const [min, max] = range;
			return {
				formCategory: { not: "REGIONAL_FORM" },
				pokedexNumber: { gte: min, lte: max },
			};
		}
	}

	return null;
}
