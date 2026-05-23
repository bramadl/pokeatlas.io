import type { Brand } from "../types/brand.type";

/**
 * @description
 * Referencing a trackable pokemon. Since species has
 * tons of forms, a trainer does not actually track a
 * species. Instead, the trainer tracks a specific form.
 *
 * This references a unique distinctive form of a specific
 * species. For instance, a `Charizard` may have *Mega* or
 * *Costume* Forms, a `Zacian` could be either *Crowned Sword*
 * or *Hero of Many Battles* forms.
 *
 * Acts as a universal referencial attribute for all cases,
 * for instance finding the species, form, even states.
 *
 * @example
 * - `CHARIZARD_NORMAL`
 * - `CHARIZARD_MEGA_X`
 * - `CHARIZARD_MEGA_Y`
 */
export type PokemonRef = Brand<string, "PokemonRef">;

export namespace PokemonRef {
	export function from(value: string): PokemonRef {
		if (!value.includes("_")) {
			throw new Error(`invalid PokemonRef: ${value}`);
		}

		return value as PokemonRef;
	}
}
