import {
	POKEDEX_STATUSES,
	POKEMON_CLASSIFICATIONS,
} from "@pokeatlas/core/types";

export {
	POKEMON_TYPES as POKEMON_TYPE_OPTIONS,
	type PokemonType as PokemonTypeOption,
} from "@/features/global/definitions/pokemon-types";

const LABEL_MAP: Record<string, string> = {
	LEGENDARY: "Legendary",
	MYTHIC: "Mythical",
	STANDARD: "Standard",
	ULTRA_BEAST: "Ultra Beast",
};

export const CLASSIFICATION_OPTIONS = POKEMON_CLASSIFICATIONS.map((c) => ({
	label: LABEL_MAP[c] ?? null,
	value: c.toLowerCase(),
})).filter((v) => v.label !== null);

export const STATUS_OPTIONS = POKEDEX_STATUSES.map((s) => ({
	label: s.charAt(0) + s.slice(1).toLowerCase(),
	value: s.toLowerCase(),
}));
