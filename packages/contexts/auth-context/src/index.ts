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
	UpdateBuddyPokemonCommand,
	type UpdateBuddyPokemonErrors,
	type UpdateBuddyPokemonHandler,
	type UpdateBuddyPokemonInput,
	type UpdateBuddyPokemonOutput,
	UpdateTeamCommand,
	type UpdateTeamErrors,
	type UpdateTeamHandler,
	type UpdateTeamInput,
	type UpdateTeamOutput,
} from "../contracts";

export class AuthContext {
	public constructor(
		private readonly handlers: {
			getTrainer: GetTrainerHandler;
			registerTrainer: RegisterTrainerHandler;
			updateBuddyPokemon: UpdateBuddyPokemonHandler;
			updateTeam: UpdateTeamHandler;
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

	public updateBuddyPokemon(
		input: UpdateBuddyPokemonInput,
	): Promise<IResult<UpdateBuddyPokemonOutput, UpdateBuddyPokemonErrors>> {
		return this.handlers.updateBuddyPokemon.execute(
			new UpdateBuddyPokemonCommand(input),
		);
	}

	public updateTeam(
		input: UpdateTeamInput,
	): Promise<IResult<UpdateTeamOutput, UpdateTeamErrors>> {
		return this.handlers.updateTeam.execute(new UpdateTeamCommand(input));
	}
}

export * from "../contracts";
