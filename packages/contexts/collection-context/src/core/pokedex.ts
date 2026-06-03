import type { PokemonRef } from "@context/shared";

export interface IPokedex {
	checkExistence(ref: PokemonRef): Promise<boolean>;
}
