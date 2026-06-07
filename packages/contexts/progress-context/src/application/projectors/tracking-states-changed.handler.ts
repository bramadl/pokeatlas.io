import type { TrackingStatesChangedPayload } from "@context/collection";
import type { DomainEvent } from "@pokepulse/toolkit";

import type { IPokedexMetadata } from "#progress:application/ports/pokedex-metadata.ts";
import type { IProgressProjection } from "#progress:application/ports/progress-projection.ts";
import { computeProgressDelta } from "#progress:application/projections/policies/compute-progress-delta.ts";

export class TrackingStatesChangedHandler {
	public constructor(
		private readonly provider: IPokedexMetadata,
		private readonly store: IProgressProjection,
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

		await Promise.all([
			this.store.applyDeltas(by.value(), deltas),
			this.store.updateLatestAcquisition(
				by.value(),
				on,
				metadata,
				to,
				"UPDATED",
			),
		]);
	}
}
