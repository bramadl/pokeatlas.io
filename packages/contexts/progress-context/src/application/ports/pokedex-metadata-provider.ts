import type {
	PokemonClassification,
	PokemonForm,
	PokemonRef,
	PokemonRegion,
} from "@context/game";

export interface PokemonMetadata {
	dexNumber: number;
	name: string;
	primaryType: string;
	region: PokemonRegion;
	secondaryType: string | null;
	sprite: {
		url: string;
		shiny: string | null;
	};
}

export interface PokemonTraits {
	formCategory: PokemonForm;
	isCostume: boolean;
	isDefaultForm: boolean;
	isFemale: boolean;
	isShadowAvailable: boolean;
	isTemporaryEvolution: boolean;
	isTradable: boolean;
	pokedexNumber: number;
	pokemonClassification: PokemonClassification | null;
	ref: string;
	region: PokemonRegion;
}

export interface IPokedexMetadataProvider {
	getMetadata(pokemonRef: PokemonRef): Promise<PokemonMetadata | null>;
	getTraits(pokemonRef: PokemonRef): Promise<PokemonTraits | null>;
}
