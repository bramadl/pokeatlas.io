import { type IPokedex, PokemonRef } from "@context/game";
import {
	type ICommand,
	Id,
	type IEventBus,
	type IResult,
	Result,
} from "@pokepulse/toolkit";

import { PokemonNotFoundError } from "#collection:core/pokemon-not-found.ts";
import { TrackedPokemon } from "#collection:core/tracked-pokemon.ts";
import { TrackedStates } from "#collection:core/tracked-states.ts";
import { TrackingSignature } from "#collection:core/tracking-signature.ts";
import type { ITrainerDex } from "#collection:core/trainer-dex.ts";

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
		private readonly eventBus: IEventBus,
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
			trackedPokemon.markAsNew();
		} else {
			trackedPokemon.updateTrackedStates(trackedStates.value());
		}

		await this.trainerDex.save(trackedPokemon).then(() => {
			const events = trackedPokemon.pullEvents();
			this.eventBus.publishAll(events);
		});

		return Result.success({
			pokemonRef: trackedPokemon.get("pokemonRef"),
			trackedStates: trackedPokemon.get("trackedStates").toRef(),
		});
	}
}
