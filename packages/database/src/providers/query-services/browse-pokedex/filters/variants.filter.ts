import type { BrowsePokedexInput } from "@context/collection";

import type { PokemonModelWhereInput } from "#prisma-client/models.ts";

export function variantsFilter(
	variants?: NonNullable<BrowsePokedexInput["filters"]>["variants"],
): PokemonModelWhereInput | null {
	const {
		alternateForm = false,
		costume = false,
		gender = false,
		temporaryEvolution = false,
	} = variants ?? {};

	const conditions: PokemonModelWhereInput[] = [];
	if (!alternateForm) {
		conditions.push({
			OR: [
				{ formCategory: { not: "ALTERNATE_FORM" } },
				{ isCostume: true },
				{ isDefaultForm: true },
			],
		});
	}

	if (!costume) conditions.push({ isCostume: false });
	if (!gender) conditions.push({ isFemale: false });
	if (!temporaryEvolution) conditions.push({ isTemporaryEvolution: false });

	if (conditions.length === 0) return null;
	if (conditions.length === 1) return conditions[0] as PokemonModelWhereInput;

	return { AND: conditions };
}
