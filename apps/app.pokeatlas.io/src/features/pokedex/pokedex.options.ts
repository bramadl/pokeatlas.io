import { POKEDEXES } from "@pokeatlas/core/types";

export const POKEDEX_OPTIONS = POKEDEXES.map((f) => ({
	label: f.charAt(0) + f.slice(1).toLowerCase(),
	value: f.toLowerCase(),
}));

export function getPokedex(index: number) {
	const item = POKEDEX_OPTIONS.at(index % POKEDEX_OPTIONS.length);
	if (!item) throw new Error("POKEDEX_OPTIONS is empty");
	return item;
}
