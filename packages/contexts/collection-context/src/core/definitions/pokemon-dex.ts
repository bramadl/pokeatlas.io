/**
 * @description
 * Defines the Pokedex grouped view by Regions.
 */
export type PokemonDex = (typeof POKEMON_DEXES)[number];
export const POKEMON_DEXES = [
	"NATIONAL",
	"KANTO",
	"JOHTO",
	"HOENN",
	"SINNOH",
	"UNOVA",
	"KALOS",
	"ALOLA",
	"GALAR",
	"HISUI",
	"PALDEA",
] as const;
