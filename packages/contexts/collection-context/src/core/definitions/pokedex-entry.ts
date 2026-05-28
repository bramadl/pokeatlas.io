import type { PokemonRef, TypeRef } from "@context/shared";

import type { PokemonForm } from "./pokemon-form";
import type { PokemonRegion } from "./pokemon-region";

export interface PokedexEntry {
	dex: number;
	form: PokemonForm;
	id: PokemonRef;
	lastModifiedAt: Date | null;
	name: string;
	region: PokemonRegion | null;
	sortGroup: number;
	sprites: { shinyUrl: string | null; url: string };
	trackedStates: string[];
	types: [TypeRef] | [TypeRef, TypeRef];
	variant: {
		isCostume: boolean;
		isDefaultForm: boolean;
		isFemale: boolean;
		isTemporaryEvolution: boolean;
	};
}
