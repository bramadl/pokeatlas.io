import type { PokemonDex } from "@context/collection/types";

export const REGIONAL_ORIGIN_SUFFIXES: Partial<Record<PokemonDex, string>> = {
	ALOLA: "ALOLA",
	GALAR: "GALARIAN",
	HISUI: "HISUIAN",
	KANTO: "KANTONIAN",
	PALDEA: "PALDEAN",
};
