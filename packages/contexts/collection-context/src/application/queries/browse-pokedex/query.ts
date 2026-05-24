import type { PokemonRef } from "@context/shared";

export interface BrowsePokedexInput {
	limit?: number;
	page?: number;
	search?: string;
	trainerId: string;
}

export interface BrowsePokedexOutput {
	entries: {
		id: PokemonRef;
		dex: number;
		form: "costume" | "regional" | "alternate" | "female" | "mega" | null;
		name: string;
		sprites: { url: string; shinyUrl: string | null };
		trackedStates: string[];
		types: string[];
		lastModifiedAt: Date;
	}[];
	hasMore: boolean;
	totalEntries: number;
}

export class BrowsePokedexQuery {
	public constructor(public readonly input: BrowsePokedexInput) {}
}
