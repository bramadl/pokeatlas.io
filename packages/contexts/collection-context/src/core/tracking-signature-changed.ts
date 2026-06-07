import type { PokemonRef, TrainerRef } from "@context/game";
import { BaseDomainEvent } from "@pokepulse/toolkit";

import { TrackedStates } from "./tracked-states";
import type { TrackingSignatureRef } from "./tracking-signature-ref";

export interface TrackingStatesChangedPayload {
	by: TrainerRef;
	from: TrackingSignatureRef[];
	on: PokemonRef;
	to: TrackingSignatureRef[];
}

export class TrackingSignatureChanged extends BaseDomainEvent<TrackingStatesChangedPayload> {
	static readonly type = "collection:tracking-states-changed" as const;

	public constructor(
		aggregateId: string,
		payload: TrackingStatesChangedPayload,
	) {
		super(
			TrackingSignatureChanged.type,
			aggregateId,
			TrackedStates.name,
			payload,
		);
	}
}
