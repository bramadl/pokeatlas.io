import type { PokemonRef } from "@context/shared";
import type { UID } from "@pokepulse/toolkit";

import type { TrackedPokemon } from "./tracked-pokemon";

export interface ITrainerDex {
	getPokemon(
		pokemonRef: PokemonRef,
		trainerId: UID,
	): Promise<TrackedPokemon | null>;
	save(pokemon: TrackedPokemon): Promise<void>;
}
