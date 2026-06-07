import type { TrackingSignatureRef } from "@context/collection";
import type { PokemonRef, PokemonType } from "@context/game";

export type CatchOfTheDaySlot =
	| "COMPLETION_URGENCY"
	| "RARITY_SPOTLIGHT"
	| "REGIONAL_FOCUS"
	| "TYPE_DIVERSITY"
	| "WILDCARD";

export interface CatchOfTheDayEntry {
	dexNumber: number;
	missingSignatures: string[];
	name: string;
	pokemonRef: PokemonRef;
	primaryType: PokemonType;
	score: number;
	secondaryType: PokemonType | null;
	shinySprite: string | null;
	slot: CatchOfTheDaySlot;
	sprite: string;
	targetSignature: TrackingSignatureRef;
}
