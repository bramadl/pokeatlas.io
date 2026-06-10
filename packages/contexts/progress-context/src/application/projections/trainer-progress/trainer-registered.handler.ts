import type { TrainerRegisteredPayload } from "@context/auth";
import type { DomainEvent } from "@pokepulse/toolkit";

import type { ITrainerProgressProjection } from "./ports/projection";

export class TrainerRegisteredHandler {
	public constructor(private readonly projection: ITrainerProgressProjection) {}

	public async handle(
		event: DomainEvent<TrainerRegisteredPayload>,
	): Promise<void> {
		if (!event.payload) return;
		const { trainerId } = event.payload;
		await this.projection.initializeForTrainer(trainerId);
	}
}
