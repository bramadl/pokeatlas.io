import { POKEMON_REGIONS, type PokemonRegion } from "./pokemon-region";

export const POKEDEX_OPTIONS = ["NATIONAL", ...POKEMON_REGIONS] as const;

export type PokedexOption = (typeof POKEDEX_OPTIONS)[number];

export const POKEDEX_ALIASES: Record<PokedexOption, string> = {
	ALOLA: "al",
	GALAR: "ga",
	HISUI: "hi",
	HOENN: "ho",
	JOHTO: "jo",
	KALOS: "kl",
	KANTO: "ka",
	NATIONAL: "na",
	PALDEA: "pa",
	SINNOH: "si",
	UNOVA: "un",
	UNREGISTERED: "ur",
} as const;

export const POKEDEX_REGIONAL_RANGES: Record<
	Exclude<PokemonRegion, "HISUI">,
	[number, number]
> = {
	ALOLA: [722, 807],
	GALAR: [810, 905],
	HOENN: [252, 386],
	JOHTO: [152, 251],
	KALOS: [650, 721],
	KANTO: [1, 151],
	PALDEA: [906, 1025],
	SINNOH: [387, 493],
	UNOVA: [494, 649],
	UNREGISTERED: [808, 809],
} as const;
