import type { PokemonRef, TrackedStateRef } from "@context/game";
import { BaseDomainEvent } from "@pokepulse/toolkit";

import { TrackedStates } from "./tracked-states";
import type { TrainerRef } from "./trainer-ref";

export interface TrackingStatesChangedPayload {
	by: TrainerRef;
	from: TrackedStateRef[];
	on: PokemonRef;
	to: TrackedStateRef[];
}

export class TrackingStatesChanged extends BaseDomainEvent<TrackingStatesChangedPayload> {
	static readonly type = "collection:tracking-states-changed" as const;

	public constructor(
		aggregateId: string,
		payload: TrackingStatesChangedPayload,
	) {
		super(TrackingStatesChanged.type, aggregateId, TrackedStates.name, payload);
	}
}
