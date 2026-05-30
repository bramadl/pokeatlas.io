import {
	type BasePokedexInput,
	REGION_DEX_RANGES,
	REGIONAL_ORIGIN_SUFFIXES,
} from "@context/collection";

import type { PokemonModelWhereInput } from "#prisma-client/models.ts";

export function dexFilter(
	dex: BasePokedexInput["dex"],
): PokemonModelWhereInput | null {
	if (dex && dex !== "NATIONAL") {
		const suffix = REGIONAL_ORIGIN_SUFFIXES[dex];
		const range =
			REGION_DEX_RANGES[dex as unknown as keyof typeof REGION_DEX_RANGES];

		if (dex === "HISUI") {
			return { ref: { contains: "HISUIAN" } };
		} else if (suffix) {
			if (range) {
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
		} else if (range) {
			const [min, max] = range;
			return {
				formCategory: { not: "REGIONAL_FORM" },
				pokedexNumber: { gte: min, lte: max },
			};
		}
	}

	return null;
}
