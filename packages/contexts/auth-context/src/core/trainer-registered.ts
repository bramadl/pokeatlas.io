import { BaseDomainEvent } from "@pokepulse/toolkit";

import { Trainer } from "./trainer";

export interface TrainerRegisteredPayload {
	authId: string;
	trainerId: string;
}

export class TrainerRegistered extends BaseDomainEvent<TrainerRegisteredPayload> {
	static readonly type = "auth:trainer-registered" as const;

	public constructor(aggregateId: string, payload: TrainerRegisteredPayload) {
		super(TrainerRegistered.type, aggregateId, Trainer.name, payload);
	}
}
