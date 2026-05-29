import type { PokemonRef } from "@context/shared";
import type { UID } from "@pokeatlas/toolkit";

import type { TrackedPokemon } from "../aggregates/tracked-pokemon.aggregate";

export interface ITrainerDex {
	getPokemon(
		pokemonRef: PokemonRef,
		trainerId: UID,
	): Promise<TrackedPokemon | null>;
	save(pokemon: TrackedPokemon): Promise<void>;
}
