import type { TrackedPokemon } from "@context/collection";
import type { IPokedex } from "@context/collection/types";

import { prisma } from "#prisma-client";

import { toDomain } from "./adapter.mapper";

export class PrismaPokedexRepositoryAdapter implements IPokedex {
	public async findByRefAndTrainerId(
		ref: string,
		trainerId: string,
	): Promise<TrackedPokemon | null> {
		const data = await prisma.trackedPokemonModel.findFirst({
			where: { pokemonForm: ref, trainerId },
		});

		if (!data) return null;
		return toDomain(data);
	}

	public async save(pokemon: TrackedPokemon): Promise<void> {
		await prisma.trackedPokemonModel.upsert({
			create: {
				pokemonForm: pokemon.get("pokemonRef"),
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
				pokemonForm_trainerId: {
					pokemonForm: pokemon.get("pokemonRef"),
					trainerId: pokemon.get("trackedBy").value(),
				},
			},
		});
	}
}
