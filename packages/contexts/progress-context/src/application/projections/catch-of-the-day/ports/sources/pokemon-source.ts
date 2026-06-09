import type { TrackingSignatureRef } from "@context/collection";
import type { PokemonRef, PokemonType } from "@context/game";

import type { PokemonTraits } from "#progress:application/contracts/pokemon-traits";

export interface CatchOfTheDayCandidate {
	dexNumber: number;
	name: string;
	ownedSignatures: Set<TrackingSignatureRef>;
	pokemonRef: PokemonRef;
	primaryType: PokemonType;
	secondaryType: PokemonType | null;
	shinySprite: string | null;
	sprite: string;
	traits: PokemonTraits;
}

export interface IPokemonSource {
	fetchCandidates(trainerId: string): Promise<CatchOfTheDayCandidate[]>;
}
