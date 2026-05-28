import type { BasePokedexInput } from "@context/collection";

import type { PokemonModelWhereInput } from "#prisma-client/models.ts";

export function statusFilter(
	status: NonNullable<BasePokedexInput["filters"]>["status"],
	trainerId: BasePokedexInput["trainerId"],
): PokemonModelWhereInput | null {
	if (status === "MISSING") {
		return { trackedPokemons: { none: { trainerId } } };
	}
	if (status === "TRACKED") {
		return { trackedPokemons: { some: { trainerId } } };
	}
	return null;
}
