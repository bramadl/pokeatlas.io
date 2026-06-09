import type { PokemonRef } from "@context/game";

import type { PokemonMetadata } from "#progress:application/contracts/pokemon-metadata";
import type { PokemonTraits } from "#progress:application/contracts/pokemon-traits";

export interface IPokemonMetadataSource {
	getMetadata(pokemonRef: PokemonRef): Promise<PokemonMetadata | null>;
	getTraits(pokemonRef: PokemonRef): Promise<PokemonTraits | null>;
}
