import type { PokemonTrackedPayload } from "@context/collection";
import type { DomainEvent } from "@pokepulse/toolkit";

import { computeProgressDelta } from "./policies/compute-progress-delta";
import type { ITrainerProgressProjection } from "./ports/projection";
import type { IPokemonMetadataSource } from "./ports/sources/pokemon-metadata-source";

export class PokemonTrackedHandler {
	public constructor(
		private readonly provider: IPokemonMetadataSource,
		private readonly projection: ITrainerProgressProjection,
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

		const deltas = computeProgressDelta(trackedStates, [], traits);
		if (deltas.length === 0) return;

		await Promise.all([
			this.projection.applyDeltas(trackedBy.value(), deltas),
			this.projection.updateLatestAcquisition(
				trackedBy.value(),
				pokemonRef,
				metadata,
				trackedStates,
				"TRACKED",
			),
		]);
	}
}
