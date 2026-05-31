import { type BasePokedexInput, TRACKABLE_STATES } from "@context/collection";

import type { PokemonModelWhereInput } from "#prisma-client/models.ts";

export function statusFilter(
	status: NonNullable<BasePokedexInput["filters"]>["status"],
	trackingSignature: BasePokedexInput["trackingSignature"],
	trainerId: BasePokedexInput["trainerId"],
): PokemonModelWhereInput | null {
	const has = trackingSignature ?? TRACKABLE_STATES.BASE;

	if (status === "MISSING") {
		return { trackedPokemons: { none: { trackedStates: { has }, trainerId } } };
	}

	if (status === "TRACKED") {
		return { trackedPokemons: { some: { trackedStates: { has }, trainerId } } };
	}

	return null;
}
