import type { Pokedex } from "@context/collection/types";

export const REGIONAL_ORIGIN_SUFFIXES: Partial<Record<Pokedex, string>> = {
	ALOLA: "ALOLA",
	GALAR: "GALARIAN",
	HISUI: "HISUIAN",
	KANTO: "KANTONIAN",
	PALDEA: "PALDEAN",
};
