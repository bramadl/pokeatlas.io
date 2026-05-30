import type { BasePokedexInput } from "@context/collection";

import type { PokemonModelWhereInput } from "#prisma-client/models.ts";

import { REGION_DEX_RANGES } from "../../../constants/region-dex-ranges";
import { REGIONAL_ORIGIN_SUFFIXES } from "../../../constants/regional-origin-suffixes";

export function dexFilter(
	dex: BasePokedexInput["dex"],
): PokemonModelWhereInput | null {
	if (dex && dex !== "NATIONAL") {
		const range = REGION_DEX_RANGES[dex];
		const suffix = REGIONAL_ORIGIN_SUFFIXES[dex];

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
