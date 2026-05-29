import type { BasePokedexInput } from "@context/collection";

import type { PokemonModelWhereInput } from "#prisma-client/models.ts";

export function statusFilter(
	status: NonNullable<BasePokedexInput["filters"]>["status"],
	trainerId: BasePokedexInput["trainerId"],
): PokemonModelWhereInput | null {
	if (status === "MISSING") {
		return {
			OR: [
				{ trackedPokemons: { none: { trainerId } } },
				{
					trackedPokemons: {
						some: { trackedStates: { isEmpty: true }, trainerId },
					},
				},
			],
		};
	}

	if (status === "TRACKED") {
		return {
			trackedPokemons: {
				some: { trackedStates: { isEmpty: false }, trainerId },
			},
		};
	}

	return null;
}
