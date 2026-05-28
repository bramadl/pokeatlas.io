import { POKEMON_REGIONS } from "./pokemon-region";

/**
 * @description
 * Defines the Pokedex grouped view by Regions.
 */
export type Pokedex = (typeof POKEDEXES)[number];
export const POKEDEXES = ["NATIONAL", ...POKEMON_REGIONS] as const;
