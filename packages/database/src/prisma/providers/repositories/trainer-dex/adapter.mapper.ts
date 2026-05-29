import { TrackedPokemon, TrackedStates } from "@context/collection";
import { DataCorruptionError, PokemonRef } from "@context/shared";
import { Id } from "@pokeatlas/toolkit";

import type { TrackedPokemonModel } from "#prisma-client/client";

export function toDomain(from: TrackedPokemonModel): TrackedPokemon {
	const trackedStatesResults = from.trackedStates.map(TrackedStates.decode);

	for (const result of trackedStatesResults) {
		if (result.isError()) {
			throw new DataCorruptionError(
				TrackedPokemon.name,
				from.species,
				result.error(),
			);
		}
	}

	const trackedPokemon = TrackedPokemon.create({
		pokemonRef: PokemonRef.from(from.species),
		trackedBy: Id(from.trainerId),
		trackedStates: trackedStatesResults.map((r) => r.value()),
	});

	if (trackedPokemon.isError()) {
		throw new DataCorruptionError(
			TrackedPokemon.name,
			from.species,
			trackedPokemon.error(),
		);
	}

	return trackedPokemon.value();
}
