import { PokemonNotFoundError, PokemonRef } from "@context/shared";
import { type ICommand, Id, type IResult, Result } from "@pokeatlas/toolkit";

import {
	type IPokedex,
	type ITrainerDex,
	TrackedPokemon,
	TrackedStates,
} from "#core";

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
		private pokedex: IPokedex,
		private trainerDex: ITrainerDex,
	) {}

	public async execute({
		input,
	}: TrackPokemonCommand): Promise<
		IResult<TrackPokemonOutput, TrackPokemonErrors>
	> {
		const pokemonRef = PokemonRef.from(input.pokemonRef);
		const trainerId = Id(input.trainerId);

		const exists = await this.pokedex.isPokemonExist(pokemonRef);
		if (!exists) {
			return Result.error(new PokemonNotFoundError(pokemonRef));
		}

		const trackedStates: TrackedStates[] = [];
		for (const combo of input.trackedStates) {
			const vo = TrackedStates.create({ states: combo });
			if (vo.isError()) return Result.error(vo.error());
			trackedStates.push(vo.value());
		}

		let trackedPokemon = await this.trainerDex.getPokemon(
			pokemonRef,
			trainerId,
		);

		if (!trackedPokemon) {
			const result = TrackedPokemon.create({
				pokemonRef,
				trackedBy: trainerId,
				trackedStates,
			});

			if (result.isError()) return Result.error(result.error());
			trackedPokemon = result.value();
		} else {
			trackedPokemon.updateStates(trackedStates);
		}

		await this.trainerDex.save(trackedPokemon);
		return Result.success({
			pokemonRef: trackedPokemon.get("pokemonRef"),
			trackedStates: trackedPokemon
				.get("trackedStates")
				.map((state) => state.signature),
		});
	}
}
