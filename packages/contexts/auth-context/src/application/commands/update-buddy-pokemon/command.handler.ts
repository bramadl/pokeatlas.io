import { PokemonRef } from "@context/game";
import { type ICommand, type IResult, Result } from "@pokepulse/toolkit";

import { TrainerNotFoundError } from "#auth:core/trainer-not-found.ts";
import type { ITrainerRepository } from "#auth:core/trainer-repository.ts";

import type {
	UpdateBuddyPokemonCommand,
	UpdateBuddyPokemonErrors,
	UpdateBuddyPokemonOutput,
} from "./command";

export class UpdateBuddyPokemonHandler
	implements
		ICommand<
			UpdateBuddyPokemonCommand,
			UpdateBuddyPokemonOutput,
			UpdateBuddyPokemonErrors
		>
{
	public constructor(private readonly repository: ITrainerRepository) {}

	public async execute({
		input,
	}: UpdateBuddyPokemonCommand): Promise<
		IResult<UpdateBuddyPokemonOutput, UpdateBuddyPokemonErrors>
	> {
		const { buddyPokemonRef, trainerId } = input;

		const trainer = await this.repository.findByTrainerId(trainerId);
		if (!trainer) return Result.error(new TrainerNotFoundError(trainerId));

		const updatedBuddyPokemon = PokemonRef.from(buddyPokemonRef);
		trainer.updateBuddyPokemon(updatedBuddyPokemon);
		await this.repository.save(trainer);

		return Result.success({ buddyPokemonRef: updatedBuddyPokemon, trainerId });
	}
}
