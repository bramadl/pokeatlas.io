import {
	type ICommand,
	type IEventBus,
	type IResult,
	Result,
} from "@pokepulse/toolkit";

import { Trainer } from "#auth:core/trainer";
import { TrainerAlreadyExistsError } from "#auth:core/trainer-already-exists.ts";
import type { ITrainerRepository } from "#auth:core/trainer-repository";

import type {
	RegisterTrainerCommand,
	RegisterTrainerErrors,
	RegisterTrainerOutput,
} from "./command";

export class RegisterTrainerHandler
	implements
		ICommand<
			RegisterTrainerCommand,
			RegisterTrainerOutput,
			RegisterTrainerErrors
		>
{
	public constructor(
		private readonly eventBus: IEventBus,
		private readonly repository: ITrainerRepository,
	) {}

	public async execute({
		input,
	}: RegisterTrainerCommand): Promise<
		IResult<RegisterTrainerOutput, RegisterTrainerErrors>
	> {
		const existing = await this.repository.findByAuthId(input.authId);
		if (existing) throw new TrainerAlreadyExistsError(input.authId);

		const trainer = Trainer.create({
			authId: input.authId,
			buddyPokemonRef: undefined,
			team: undefined,
		});

		if (trainer.isError()) {
			return Result.error(trainer.error(), { ...trainer.error() });
		}

		trainer.value().register();
		await this.repository.save(trainer.value()).then(async () => {
			const events = trainer.value().pullEvents();
			await this.eventBus.publishAll(events);
		});

		const result: RegisterTrainerOutput = {
			trainerId: trainer.value().id.value(),
		};

		return Result.success(result);
	}
}
