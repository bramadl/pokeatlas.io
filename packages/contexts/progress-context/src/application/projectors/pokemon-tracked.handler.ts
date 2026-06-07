import type { PokemonTrackedPayload } from "@context/collection";
import type { DomainEvent } from "@pokepulse/toolkit";

import type { IPokedexMetadata } from "#progress:application/ports/pokedex-metadata.ts";
import type { IProgressProjection } from "#progress:application/ports/progress-projection.ts";
import { computeProgressDelta } from "#progress:application/projections/policies/compute-progress-delta.ts";

export class PokemonTrackedHandler {
	public constructor(
		private readonly provider: IPokedexMetadata,
		private readonly store: IProgressProjection,
	) {}

	public async handle(
		event: DomainEvent<PokemonTrackedPayload>,
	): Promise<void> {
		if (!event.payload) return;

		const { pokemonRef, trackedBy, trackedStates } = event.payload;

		const [traits, metadata] = await Promise.all([
			this.provider.getTraits(pokemonRef),
			this.provider.getMetadata(pokemonRef),
		]);

		if (!traits) {
			console.warn(`[PokemonTrackedHandler] traits not found: ${pokemonRef}`);
			return;
		} else if (!metadata) {
			console.warn(`[PokemonTrackedHandler] metadata not found: ${pokemonRef}`);
			return;
		}

		// PokemonTracked = brand new pokemon, from is always []
		const deltas = computeProgressDelta(trackedStates, [], traits);
		if (deltas.length === 0) return;

		await Promise.all([
			this.store.applyDeltas(trackedBy.value(), deltas),
			this.store.updateLatestAcquisition(
				trackedBy.value(),
				pokemonRef,
				metadata,
				trackedStates,
				"TRACKED",
			),
		]);
	}
}
