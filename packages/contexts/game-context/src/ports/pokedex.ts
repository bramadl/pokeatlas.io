import type { PokemonRef } from "@context/game";

export interface IPokedex {
	checkExistence(ref: PokemonRef): Promise<boolean>;
}
