import type {
	PokemonForm,
	PokemonRef,
	PokemonRegion,
	PokemonType,
} from "@context/game";

import type { TrackingSignatureRef } from "#collection:core/tracking-signature-ref.ts";

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
	trackedStates: TrackingSignatureRef[];
}
