import type { IPokedex } from "@context/collection/core/pokedex";
import type { IPokemonCatalog } from "@context/collection/core/pokemon-catalog";
import { PokemonTracked } from "@context/collection/core/pokemon-tracked";
import { TrackedPokemon } from "@context/collection/core/tracked-pokemon";
import { TrackedStates } from "@context/collection/core/tracked-states";
import { PokemonNotFoundError, PokemonRef } from "@context/shared";
import {
	type ICommand,
	Id,
	type IEventBus,
	type IResult,
	Result,
} from "@pokeatlas/toolkit";

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
		private eventBus: IEventBus,
		private catalog: IPokemonCatalog,
		private pokedex: IPokedex,
	) {}

	public async execute({
		input,
	}: TrackPokemonCommand): Promise<
		IResult<TrackPokemonOutput, TrackPokemonErrors>
	> {
		const referencedPokemon = await this.catalog.findByRef(input.pokemonRef);
		if (!referencedPokemon) {
			return Result.error(new PokemonNotFoundError(input.pokemonRef));
		}

		const trackedStates: TrackedStates[] = [];
		for (const combo of input.trackedStates) {
			const vo = TrackedStates.create({ states: combo });
			if (vo.isError()) return Result.error(vo.error());
			trackedStates.push(vo.value());
		}

		let trackedPokemon = await this.pokedex.findByRefAndTrainerId(
			input.pokemonRef,
			input.trainerId,
		);

		if (!trackedPokemon) {
			const result = TrackedPokemon.create({
				pokemonRef: PokemonRef.from(input.pokemonRef),
				trackedBy: Id(input.trainerId),
				trackedStates,
			});

			if (result.isError()) return Result.error(result.error());
			trackedPokemon = result.value();
		} else {
			trackedPokemon.updateStates(trackedStates);
		}

		await this.pokedex.save(trackedPokemon);
		await this.eventBus.publish(
			new PokemonTracked(trackedPokemon.id.value(), trackedPokemon),
		);

		return Result.success(undefined);
	}
}
