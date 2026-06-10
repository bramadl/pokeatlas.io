import type { PokemonTrackedPayload } from "@context/collection";
import type { DomainEvent } from "@pokepulse/toolkit";

import { checkFirstCatchByState } from "./achievements/policies/achievement-checker";
import type { ITrainerAchievementProjection } from "./achievements/ports/projection";
import { computeProgressDelta } from "./policies/compute-progress-delta";
import type { ITrainerProgressProjection } from "./ports/projection";
import type { IPokemonMetadataSource } from "./ports/sources/pokemon-metadata-source";

export class PokemonTrackedHandler {
	public constructor(
		private readonly provider: IPokemonMetadataSource,
		private readonly projection: ITrainerProgressProjection,
		private readonly achievements: ITrainerAchievementProjection,
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

		const trainerId = trackedBy.value();
		await Promise.all([
			this.projection.applyDeltas(trainerId, deltas, {
				pokemonName: metadata.name,
				pokemonRef,
			}),
			this.projection.updateLatestAcquisition(
				trainerId,
				pokemonRef,
				metadata,
				trackedStates,
				"TRACKED",
			),
		]);

		const nonBaseStates = trackedStates.filter((s) => s !== "BASE");
		if (nonBaseStates.length > 0) {
			await checkFirstCatchByState(
				trainerId,
				nonBaseStates,
				this.achievements,
				metadata.name,
				pokemonRef,
			);
		}
	}
}
