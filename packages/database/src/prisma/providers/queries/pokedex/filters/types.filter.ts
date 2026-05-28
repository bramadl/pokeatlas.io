import type { BasePokedexInput } from "@context/collection";

import type { PokemonModelWhereInput } from "#prisma-client/models.ts";

export function typesFilter(
	types: NonNullable<BasePokedexInput["filters"]>["types"],
): PokemonModelWhereInput | null {
	if (types?.length) {
		const [a, b] = types;
		if (!b) {
			return {
				OR: [{ primaryTypeId: a }, { secondaryTypeId: a }],
			};
		} else {
			return {
				OR: [
					{ AND: [{ primaryTypeId: a }, { secondaryTypeId: b }] },
					{ AND: [{ primaryTypeId: b }, { secondaryTypeId: a }] },
				],
			};
		}
	}

	return null;
}
