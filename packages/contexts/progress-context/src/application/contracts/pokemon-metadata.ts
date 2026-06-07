import type { PokemonRegion, PokemonType } from "@context/game";

export interface PokemonMetadata {
	dexNumber: number;
	name: string;
	primaryType: PokemonType;
	region: PokemonRegion;
	secondaryType: PokemonType | null;
	sprite: {
		url: string;
		shiny: string | null;
	};
}
