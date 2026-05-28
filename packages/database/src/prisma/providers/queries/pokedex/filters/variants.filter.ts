import type { BasePokedexInput } from "@context/collection";

import type { PokemonModelWhereInput } from "#prisma-client/models.ts";

export function variantsFilter(
	variants?: NonNullable<BasePokedexInput["filters"]>["variants"],
): PokemonModelWhereInput | null {
	const {
		alternateForm = false,
		costume = false,
		gender = false,
		temporaryEvolution = false,
	} = variants ?? {};

	if (!alternateForm) {
		return {
			OR: [
				{ formCategory: { not: "ALTERNATE_FORM" } },
				{ isCostume: true },
				{ isDefaultForm: true },
			],
		};
	}

	if (!costume) return { isCostume: false };
	if (!gender) return { isFemale: false };
	if (!temporaryEvolution) return { isTemporaryEvolution: false };

	return null;
}
