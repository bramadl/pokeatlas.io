export const POKEMON_CLASSIFICATIONS = [
	"STANDARD",
	"LEGENDARY",
	"MYTHIC",
	"ULTRA_BEAST",
] as const;

export type PokemonClassification = (typeof POKEMON_CLASSIFICATIONS)[number];
export namespace PokemonClassificationRef {
	export function from(value: string): PokemonClassification {
		if (!(POKEMON_CLASSIFICATIONS as readonly string[]).includes(value)) {
			throw new Error(`Invalid PokemonClassification: ${value}`);
		}
		return value as PokemonClassification;
	}
}

export const CLASSIFICATION_ALIASES: Record<PokemonClassification, string> = {
	LEGENDARY: "lg",
	MYTHIC: "mt",
	STANDARD: "st",
	ULTRA_BEAST: "ub",
} as const;
