import type { PokemonRef, TypeRef } from "@context/shared";

import type { PokemonForm, PokemonRegion } from "#core";

export interface PokedexEntry {
	dex: number;
	form: PokemonForm;
	id: PokemonRef;
	lastModifiedAt: Date | null;
	name: string;
	region: PokemonRegion;
	sortGroup: number;
	sprites: { shinyUrl: string | null; url: string };
	trackedStates: string[];
	types: [TypeRef] | [TypeRef, TypeRef];
	variant: {
		isCostume: boolean;
		isFemale: boolean;
		isTemporaryEvolution: boolean;
	};
}
