/**
 * @description
 * Defines the Pokemon classification such as Legendary, Mythical, or Ultra Beast.
 */
export type PokemonClassification = (typeof POKEMON_CLASSIFICATIONS)[number];
export const POKEMON_CLASSIFICATIONS = [
	"STANDARD",
	"LEGENDARY",
	"MYTHIC",
	"ULTRA_BEAST",
] as const;
