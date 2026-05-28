import { POKEDEXES } from "@pokeatlas/core/types";

export const POKEDEX_OPTIONS = POKEDEXES.map((f) => ({
	label: f.charAt(0) + f.slice(1).toLowerCase(),
	value: f.toLowerCase(),
}));
