import type { BrowsePokedexInput } from "@context/collection";
import { TRACKABLE_STATE } from "@context/collection/types";

import type { PokemonModelWhereInput } from "#prisma-client/models.ts";

export function statusFilter(
	status: NonNullable<BrowsePokedexInput["filters"]>["status"],
	trackingSignature: BrowsePokedexInput["trackingSignature"],
	trainerId: BrowsePokedexInput["trainerId"],
): PokemonModelWhereInput | null {
	const has = trackingSignature ?? TRACKABLE_STATE.BASE;

	if (status === "MISSING") {
		return { trackedPokemons: { none: { trackedStates: { has }, trainerId } } };
	}

	if (status === "TRACKED") {
		return { trackedPokemons: { some: { trackedStates: { has }, trainerId } } };
	}

	return null;
}
