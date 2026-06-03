export const POKEMON_CLASSIFICATIONS = [
	"STANDARD",
	"LEGENDARY",
	"MYTHIC",
	"ULTRA_BEAST",
] as const;

export type PokemonClassification = (typeof POKEMON_CLASSIFICATIONS)[number];

export const CLASSIFICATION_ALIASES: Record<PokemonClassification, string> = {
	LEGENDARY: "lg",
	MYTHIC: "mt",
	STANDARD: "st",
	ULTRA_BEAST: "ub",
} as const;
