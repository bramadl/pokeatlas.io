import type { PokemonRef, TypeRef } from "@context/shared";

import type { PokemonForm } from "./pokemon-form";
import type { PokemonRegion } from "./pokemon-region";
import type { TrackedStateRef } from "./tracked-state-ref";

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
		types: [TypeRef] | [TypeRef, TypeRef];
		variants: {
			isCostume: boolean;
			isDefaultForm: boolean;
			isFemale: boolean;
			isTemporaryEvolution: boolean;
		};
	};
	trackedStates: TrackedStateRef[];
}
