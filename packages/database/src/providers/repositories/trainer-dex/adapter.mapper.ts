import {
	TrackedPokemon,
	TrackedStates,
	TrackingSignature,
} from "@context/collection";
import { PokemonRef } from "@context/game";
import { Id } from "@pokepulse/toolkit";

import type { TrackedPokemonModel } from "#prisma-client/client";
import { DataCorruptionError } from "#providers/errors/data-corruption.error.ts";

export function toTrackedPokemon(from: TrackedPokemonModel): TrackedPokemon {
	const signatures: TrackingSignature[] = [];
	for (const state of from.trackedStates) {
		const signature = TrackingSignature.create(state);
		if (signature.isError()) {
			throw new DataCorruptionError(
				TrackedPokemon.name,
				from.species,
				signature.error(),
			);
		}

		signatures.push(signature.value().sorted());
	}

	const trackedStates = TrackedStates.create({ signatures });
	if (trackedStates.isError()) {
		throw new DataCorruptionError(
			TrackedPokemon.name,
			from.species,
			trackedStates.error(),
		);
	}

	const trackedPokemon = TrackedPokemon.create({
		pokemonRef: PokemonRef.from(from.species),
		trackedBy: Id(from.trainerId),
		trackedStates: trackedStates.value(),
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
