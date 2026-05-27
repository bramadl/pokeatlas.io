import type { TrackedPokemon } from "../aggregates/tracked-pokemon.aggregate";

/**
 * @description
 * Describes the pokedex owns by each trainer.
 */
export interface IPokedex {
	findByRefAndTrainerId(
		ref: string,
		trainerId: string,
	): Promise<TrackedPokemon | null>;
	save(pokemon: TrackedPokemon): Promise<void>;
}
