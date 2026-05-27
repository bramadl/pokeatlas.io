/**
 * @description
 * List of the known pokemon forms categorized.
 */
export type PokemonForm = (typeof POKEMON_FORMS)[number];
export const POKEMON_FORMS = [
	"ALTERNATE_FORM",
	"BASE_FORM",
	"REGIONAL_FORM",
] as const;
