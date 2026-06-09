import type { TrackingStatesChangedPayload } from "@context/collection";
import type { DomainEvent } from "@pokepulse/toolkit";
import { checkFirstCatchByState } from "../achievements/policies/achievement-checker";
import type { ITrainerAchievementProjection } from "../achievements/ports/projection";
import { computeProgressDelta } from "./policies/compute-progress-delta";
import type { ITrainerProgressProjection } from "./ports/projection";
import type { IPokemonMetadataSource } from "./ports/sources/pokemon-metadata-source";

export class TrackingStatesChangedHandler {
	public constructor(
		private readonly provider: IPokemonMetadataSource,
		private readonly projection: ITrainerProgressProjection,
		private readonly achievements: ITrainerAchievementProjection,
	) {}

	public async handle(
		event: DomainEvent<TrackingStatesChangedPayload>,
	): Promise<void> {
		if (!event.payload) return;

		const { by, from, on, to } = event.payload;

		const [traits, metadata] = await Promise.all([
			this.provider.getTraits(on),
			this.provider.getMetadata(on),
		]);

		if (!traits) {
			console.warn(`[TrackingStatesChangedHandler] traits not found: ${on}`);
			return;
		} else if (!metadata) {
			console.warn(`[TrackingStatesChangedHandler] metadata not found: ${on}`);
			return;
		}

		const added = to.filter((s) => !from.includes(s));
		const removed = from.filter((s) => !to.includes(s));

		if (added.length === 0 && removed.length === 0) return;

		const deltas = computeProgressDelta(added, removed, traits);
		if (deltas.length === 0) return;

		const trainerId = by.value();

		await Promise.all([
			this.projection.applyDeltas(trainerId, deltas, {
				pokemonName: metadata.name,
				pokemonRef: on,
			}),
			this.projection.updateLatestAcquisition(
				trainerId,
				on,
				metadata,
				to,
				"UPDATED",
			),
		]);

		// ── Achievement checks ──────────────────────────────────────────────────
		// Only check newly added non-BASE states for first-catch achievements
		const newNonBaseStates = added.filter((s) => s !== "BASE");
		if (newNonBaseStates.length > 0) {
			await checkFirstCatchByState(
				trainerId,
				newNonBaseStates,
				this.achievements,
				metadata.name,
				on,
			);
		}
	}
}
