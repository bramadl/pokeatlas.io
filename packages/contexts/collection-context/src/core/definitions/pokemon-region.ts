import type { Pokedex } from "./pokedex";

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

export const REGIONAL_ORIGIN_SUFFIXES: Partial<Record<Pokedex, string>> = {
	ALOLA: "ALOLA",
	GALAR: "GALARIAN",
	HISUI: "HISUIAN",
	KANTO: "KANTONIAN",
	PALDEA: "PALDEAN",
} as const;

export type RegionalOriginSuffix =
	(typeof REGIONAL_ORIGIN_SUFFIXES)[keyof typeof REGIONAL_ORIGIN_SUFFIXES];

export const REGION_DEX_RANGES: Record<
	Exclude<PokemonRegion, "HISUI">,
	[number, number]
> = {
	ALOLA: [722, 809],
	GALAR: [810, 905],
	HOENN: [252, 386],
	JOHTO: [152, 251],
	KALOS: [650, 721],
	KANTO: [1, 151],
	PALDEA: [906, 1025],
	SINNOH: [387, 493],
	UNOVA: [494, 649],
} as const;

export type RegionDexRange =
	(typeof REGION_DEX_RANGES)[keyof typeof REGION_DEX_RANGES];
