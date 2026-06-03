import type {
	InfinitePagination,
	InfinitePaginationReturns,
} from "@context/shared";

import type { PokedexEntry } from "#contracts/pokedex-entry.ts";
import type { PokedexOption } from "#contracts/pokedex-options.ts";
import type { PokemonClassification } from "#contracts/pokemon-classification.ts";
import type { TrackingStatus } from "#contracts/tracking-status.ts";

export interface BrowsePokedexInput extends InfinitePagination {
	filters?: Partial<{
		classifications: PokemonClassification[];
		search: string;
		status: TrackingStatus;
		pokedex: PokedexOption;
		types: string[];
		variants: Partial<{
			alternateForm: boolean;
			costume: boolean;
			gender: boolean;
			temporaryEvolution: boolean;
		}>;
	}>;
	trackingSignature?: string;
	trainerId: string;
}

export interface BrowsePokedexOutput extends InfinitePaginationReturns {
	entries: PokedexEntry[];
}

export class BrowsePokedexQuery {
	public constructor(public readonly input: BrowsePokedexInput) {}
}
