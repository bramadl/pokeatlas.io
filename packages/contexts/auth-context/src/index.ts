import type { IResult } from "@pokepulse/toolkit";

import {
	type GetTrainerHandler,
	type GetTrainerInput,
	type GetTrainerOutput,
	GetTrainerQuery,
	RegisterTrainerCommand,
	type RegisterTrainerErrors,
	type RegisterTrainerHandler,
	type RegisterTrainerInput,
	type RegisterTrainerOutput,
} from "../contracts";

export class AuthContext {
	public constructor(
		private readonly handlers: {
			getTrainer: GetTrainerHandler;
			registerTrainer: RegisterTrainerHandler;
		},
	) {}

	public getTrainer(
		input: GetTrainerInput,
	): Promise<IResult<GetTrainerOutput>> {
		return this.handlers.getTrainer.execute(new GetTrainerQuery(input));
	}

	public registerTrainer(
		input: RegisterTrainerInput,
	): Promise<IResult<RegisterTrainerOutput, RegisterTrainerErrors>> {
		return this.handlers.registerTrainer.execute(
			new RegisterTrainerCommand(input),
		);
	}
}

export * from "../contracts";
