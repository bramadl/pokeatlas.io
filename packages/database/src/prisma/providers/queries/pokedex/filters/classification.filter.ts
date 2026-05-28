import type { BasePokedexInput } from "@context/collection/types";

import type { PokemonModelWhereInput } from "#prisma-client/models.ts";

export function classificationFilter(
	classifications?: NonNullable<BasePokedexInput["filters"]>["classification"],
): PokemonModelWhereInput | null {
	if (classifications?.length) {
		const enumValues = classifications.filter((c) => c !== "STANDARD");
		const includeStandard = classifications.includes("STANDARD");

		if (enumValues.length && includeStandard) {
			return {
				OR: [
					{ pokemonClassification: { in: enumValues } },
					{ pokemonClassification: null },
				],
			};
		} else if (enumValues.length) {
			return { pokemonClassification: { in: enumValues } };
		} else {
			return { pokemonClassification: null };
		}
	}

	return null;
}
