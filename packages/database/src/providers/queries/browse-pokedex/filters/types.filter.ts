import type { BrowsePokedexInput } from "@context/collection";

import type { PokemonModelWhereInput } from "#prisma-client/models.ts";

export function typesFilter(
	types: NonNullable<BrowsePokedexInput["filters"]>["types"],
): PokemonModelWhereInput | null {
	if (types?.length) {
		const [a, b] = types as [string, string];
		if (!b) {
			return {
				OR: [
					{ primaryTypeId: { endsWith: a.toUpperCase() } },
					{ secondaryTypeId: { endsWith: a.toUpperCase() } },
				],
			};
		} else {
			return {
				OR: [
					{
						AND: [
							{ primaryTypeId: { endsWith: a.toUpperCase() } },
							{ secondaryTypeId: { endsWith: b.toUpperCase() } },
						],
					},
					{
						AND: [
							{ primaryTypeId: { endsWith: b.toUpperCase() } },
							{ secondaryTypeId: { endsWith: a.toUpperCase() } },
						],
					},
				],
			};
		}
	}

	return null;
}
