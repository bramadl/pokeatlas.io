/**
 * @description
 * List of all regions exist in Pokemon world.
 */
export type PokemonRegion = (typeof POKEMON_REGIONS)[number];
export const POKEMON_REGIONS = [
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
