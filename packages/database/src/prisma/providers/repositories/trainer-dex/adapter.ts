import type { ITrainerDex, TrackedPokemon } from "@context/collection";
import type { PokemonRef } from "@context/shared";
import { Id, type UID } from "@pokeatlas/toolkit";

import { prisma } from "#prisma-client";

import { toDomain } from "./adapter.mapper";

export class PrismaTrainerDexRepositoryAdapter implements ITrainerDex {
	public async getPokemon(
		pokemonRef: PokemonRef,
		trainerId: UID,
	): Promise<TrackedPokemon | null> {
		const data = await prisma.trackedPokemonModel.findUnique({
			where: {
				species_trainerId: {
					species: pokemonRef,
					trainerId: trainerId.value(),
				},
			},
		});

		if (!data) return null;
		return toDomain(data);
	}

	public async save(pokemon: TrackedPokemon): Promise<void> {
		await prisma.trackedPokemonModel.upsert({
			create: {
				id: Id().value(),
				species: pokemon.get("pokemonRef"),
				trackedStates: pokemon
					.get("trackedStates")
					.map((combo) => combo.encode()),
				trainerId: pokemon.get("trackedBy").value(),
			},
			update: {
				trackedStates: pokemon
					.get("trackedStates")
					.map((combo) => combo.encode()),
			},
			where: {
				species_trainerId: {
					species: pokemon.get("pokemonRef"),
					trainerId: pokemon.get("trackedBy").value(),
				},
			},
		});
	}
}
