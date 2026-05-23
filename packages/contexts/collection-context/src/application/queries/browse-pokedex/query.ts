import type { PokemonRef } from "@context/shared";

export interface BrowsePokedexInput {
	trainerId: string;
}

export interface BrowsePokedexOutput {
	entries: {
		id: PokemonRef;
		isTracked: boolean;
		name: string;
		sprites: { url: string | null; shinyUrl: string | null };
	}[];
	totalEntries: number;
}

export class BrowsePokedexQuery {
	public constructor(public readonly input: BrowsePokedexInput) {}
}
