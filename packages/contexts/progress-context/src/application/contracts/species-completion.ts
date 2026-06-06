import type { PokemonRegion } from "@context/game";

export interface SpeciesCompletion {
	completionPercentage: number;
	mostCompleteRegion: {
		region: PokemonRegion;
		completionPercentage: number;
	} | null;
	total: number;
	tracked: number;
}
