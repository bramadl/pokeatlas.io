import type { PokedexStatus, PokemonClassification, PokemonDex } from "#core";

import type { PokedexEntry } from "../../contracts/pokedex-entry";

export interface BrowsePokedexInput {
	dex?: PokemonDex;
	filters?: Partial<{
		classification: PokemonClassification[];
		search: string;
		status: PokedexStatus;
		types: [string] | [string, string];
		variants: Partial<{
			alternateForm: boolean;
			costume: boolean;
			gender: boolean;
			temporaryEvolution: boolean;
		}>;
	}>;
	pagination: { limit: number; page: number };
	trainerId: string;
}

export interface BrowsePokedexOutput {
	entries: PokedexEntry[];
	hasMore: boolean;
	totalEntries: number;
}

export interface IPokedexService {
	browse(input: BrowsePokedexInput): Promise<BrowsePokedexOutput>;
}
