import type { PokemonRef } from "@context/shared";

export interface BrowsePokedexInput {
	form?: "costume" | "regional" | "female" | "mega";
	limit?: number;
	page?: number;
	search?: string;
	status?: "caught" | "missing";
	trainerId: string;
	types?: string[];
}

export interface BrowsePokedexOutput {
	entries: {
		id: PokemonRef;
		dex: number;
		form: "costume" | "regional" | "female" | "mega" | null;
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
