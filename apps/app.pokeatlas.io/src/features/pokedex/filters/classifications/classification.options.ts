import { POKEMON_CLASSIFICATIONS } from "@pokeatlas/core/types";

const LABEL_MAP: Record<string, string> = {
	LEGENDARY: "Legendary",
	MYTHIC: "Mythical",
	STANDARD: "Standard",
	ULTRA_BEAST: "Ultra Beast",
};

export const CLASSIFICATION_OPTIONS = POKEMON_CLASSIFICATIONS.map((s) => ({
	label: LABEL_MAP[s] ?? s,
	value: s.toLowerCase(),
}));
