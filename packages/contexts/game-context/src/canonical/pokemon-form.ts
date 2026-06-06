export const POKEMON_FORMS = [
	"ALTERNATE_FORM",
	"BASE_FORM",
	"REGIONAL_FORM",
] as const;

export type PokemonForm = (typeof POKEMON_FORMS)[number];
export namespace PokemonFormRef {
	export function from(value: string): PokemonForm {
		if (!(POKEMON_FORMS as readonly string[]).includes(value)) {
			throw new Error(`Invalid PokemonForm: ${value}`);
		}
		return value as PokemonForm;
	}
}
