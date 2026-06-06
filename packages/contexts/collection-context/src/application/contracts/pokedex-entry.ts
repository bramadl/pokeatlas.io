import type {
	PokemonForm,
	PokemonRef,
	PokemonRegion,
	PokemonType,
	TrackedStateRef,
} from "@context/game";

export interface PokedexEntry {
	lastModifiedAt: Date | null;
	sortGroup: number;
	species: {
		dexNumber: number;
		form: PokemonForm;
		id: PokemonRef;
		shadowEligible: boolean;
		name: string;
		region: PokemonRegion;
		sprites: { shinyUrl: string | null; url: string };
		types: [PokemonType] | [PokemonType, PokemonType];
		variants: {
			isCostume: boolean;
			isDefaultForm: boolean;
			isFemale: boolean;
			isTemporaryEvolution: boolean;
		};
	};
	trackedStates: TrackedStateRef[];
}
