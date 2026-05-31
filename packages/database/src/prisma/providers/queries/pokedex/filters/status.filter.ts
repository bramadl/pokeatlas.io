import type { BasePokedexInput } from "@context/collection";

import type { PokemonModelWhereInput } from "#prisma-client/models.ts";

export function statusFilter(
	status: NonNullable<BasePokedexInput["filters"]>["status"],
	signature: NonNullable<BasePokedexInput["filters"]>["signature"],
	trainerId: BasePokedexInput["trainerId"],
): PokemonModelWhereInput | null {
	const sig = signature ?? "BASE";

	if (status === "MISSING") {
		return {
			trackedPokemons: { none: { trackedStates: { has: sig }, trainerId } },
		};
	}

	if (status === "TRACKED") {
		return {
			trackedPokemons: { some: { trackedStates: { has: sig }, trainerId } },
		};
	}

	return null;
}
