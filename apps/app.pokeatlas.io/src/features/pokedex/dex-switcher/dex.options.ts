import { POKEMON_DEXES } from "@pokeatlas/core/types";

export const DEX_OPTIONS = POKEMON_DEXES.map((f) => ({
	label: f.charAt(0) + f.slice(1).toLowerCase(),
	value: f.toLowerCase(),
}));
