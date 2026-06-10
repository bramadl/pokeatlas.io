import type { DomainError } from "@pokepulse/toolkit";

import type { TrainerAlreadyExistsError } from "#auth:core/trainer-already-exists.ts";

export interface RegisterTrainerInput {
	authId: string;
}

export interface RegisterTrainerOutput {
	trainerId: string;
}

export type RegisterTrainerErrors = TrainerAlreadyExistsError | DomainError;

export class RegisterTrainerCommand {
	public constructor(public readonly input: RegisterTrainerInput) {}
}
