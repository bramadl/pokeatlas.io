import type { PokemonRef } from "@context/shared";

import type {
	BrowsePokedexInput,
	BrowsePokedexOutput,
	CountPokedexInput,
	CountPokedexOutput,
} from "../contracts/pokedex.contract";

/**
 * @description
 * A port for accessign the pokedex.
 */
export interface IPokedex {
	browse(input: BrowsePokedexInput): Promise<BrowsePokedexOutput>;
	countPokedexEntries(input: CountPokedexInput): Promise<CountPokedexOutput>;
	isPokemonExist(ref: PokemonRef): Promise<boolean>;
}
