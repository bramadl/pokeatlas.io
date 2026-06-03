import type { BrowsePokedexInput } from "@context/collection";

import type { PokemonModelWhereInput } from "#prisma-client/models.ts";

export function classificationsFilter(
	classifications?: NonNullable<
		BrowsePokedexInput["filters"]
	>["classifications"],
): PokemonModelWhereInput | null {
	if (!classifications || classifications.length === 0) return null;

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
