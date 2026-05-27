/**
 * @description
 * List of all regions exist in Pokemon world.
 */
export type PokemonRegion = (typeof POKEMON_REGIONS)[number];
export const POKEMON_REGIONS = [
	"ALOLA",
	"GALAR",
	"HISUI",
	"HOENN",
	"JOHTO",
	"KALOS",
	"KANTO",
	"PALDEA",
	"SINNOH",
	"UNOVA",
] as const;
