import type { TrackedPokemon } from "./tracked-pokemon";

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
