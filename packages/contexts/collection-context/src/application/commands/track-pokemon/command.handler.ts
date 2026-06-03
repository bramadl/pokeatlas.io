import { PokemonRef } from "@context/shared";
import { type ICommand, Id, type IResult, Result } from "@pokepulse/toolkit";

import { PokemonNotFoundError } from "#contracts/pokemon-not-found.error.ts";
import type { IPokedex } from "#core/pokedex.ts";
import { TrackedPokemon } from "#core/tracked-pokemon.ts";
import { TrackedStates } from "#core/tracked-states.ts";
import { TrackingSignature } from "#core/tracking-signature.ts";
import type { ITrainerDex } from "#core/trainer-dex.ts";

import type {
	TrackPokemonCommand,
	TrackPokemonErrors,
	TrackPokemonOutput,
} from "./command";

export class TrackPokemonHandler
	implements
		ICommand<TrackPokemonCommand, TrackPokemonOutput, TrackPokemonErrors>
{
	public constructor(
		private readonly pokedex: IPokedex,
		private readonly trainerDex: ITrainerDex,
	) {}

	public async execute({
		input,
	}: TrackPokemonCommand): Promise<
		IResult<TrackPokemonOutput, TrackPokemonErrors>
	> {
		const pokemonRef = PokemonRef.from(input.pokemonRef);
		const trainerId = Id(input.trainerId);

		const exists = await this.pokedex.checkExistence(pokemonRef);
		if (!exists) {
			return Result.error(new PokemonNotFoundError(pokemonRef));
		}

		const signatures: TrackingSignature[] = [];
		for (const trackedState of input.trackedStates) {
			const signature = TrackingSignature.create(trackedState);
			if (signature.isError()) return Result.error(signature.error());
			signatures.push(signature.value().sorted());
		}

		const trackedStates = TrackedStates.create({ signatures });
		if (trackedStates.isError()) return Result.error(trackedStates.error());

		let trackedPokemon = await this.trainerDex.getPokemon(
			pokemonRef,
			trainerId,
		);

		if (!trackedPokemon) {
			const result = TrackedPokemon.create({
				pokemonRef,
				trackedBy: trainerId,
				trackedStates: trackedStates.value(),
			});

			if (result.isError()) return Result.error(result.error());
			trackedPokemon = result.value();
		} else {
			trackedPokemon.updateTrackedStates(trackedStates.value());
		}

		await this.trainerDex.save(trackedPokemon);

		return Result.success({
			pokemonRef: trackedPokemon.get("pokemonRef"),
			trackedStates: trackedPokemon.get("trackedStates").toRef(),
		});
	}
}
