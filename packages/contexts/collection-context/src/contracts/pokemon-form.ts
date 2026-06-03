export const POKEMON_FORMS = [
	"ALTERNATE_FORM",
	"BASE_FORM",
	"REGIONAL_FORM",
] as const;

export type PokemonForm = (typeof POKEMON_FORMS)[number];
