import type { Brand } from "../types/brand.type";

export type PokemonRef = Brand<string, "PokemonRef">;

export namespace PokemonRef {
	export function from(value: string): PokemonRef {
		if (!value.includes("_")) {
			throw new Error(`invalid PokemonRef: ${value}`);
		}

		return value as PokemonRef;
	}
}
