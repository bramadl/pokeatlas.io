import type { Brand } from "../types/brand.type";

/**
 * @description
 * A stable reference used to define a type coming from upstream.
 * This could be referenced by a `pokemon.types` or `move.types`.
 *
 * @example
 * - `BUG`
 * - `FIRE`
 * - `WATER`
 */
export type TypeRef = Brand<string, "TypeRef">;

export namespace TypeRef {
	export function from(value: string): TypeRef {
		return value as TypeRef;
	}
}
