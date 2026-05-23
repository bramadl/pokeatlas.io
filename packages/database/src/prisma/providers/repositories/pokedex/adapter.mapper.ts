import { TrackedPokemon } from "@context/collection";
import { TrackedStates } from "@context/collection/src/core/tracked-states";
import { DataCorruptionError, PokemonRef } from "@context/shared";
import { Id } from "@pokeatlas/toolkit";
import type { TrackedPokemonModel } from "@prisma-client/client";

export function mapTrackedPokemon(from: TrackedPokemonModel): TrackedPokemon {
	const trackedStatesResults = from.trackedStates.map(TrackedStates.decode);

	for (const result of trackedStatesResults) {
		if (result.isError()) {
			throw new DataCorruptionError(
				TrackedPokemon.name,
				from.pokemonForm,
				result.error(),
			);
		}
	}

	const trackedPokemon = TrackedPokemon.create({
		pokemonRef: PokemonRef.from(from.pokemonForm),
		trackedBy: Id(from.trainerId),
		trackedStates: trackedStatesResults.map((r) => r.value()),
	});

	if (trackedPokemon.isError()) {
		throw new DataCorruptionError(
			TrackedPokemon.name,
			from.pokemonForm,
			trackedPokemon.error(),
		);
	}

	return trackedPokemon.value();
}
