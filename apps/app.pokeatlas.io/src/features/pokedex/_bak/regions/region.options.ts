import { POKEMON_REGIONS } from "@pokeatlas/core/types";

export const REGION_OPTIONS = POKEMON_REGIONS.map((r) => ({
	label: r.charAt(0) + r.slice(1).toLowerCase(), // "Alola", "Galar", …
	value: r.toLowerCase(),
}));
