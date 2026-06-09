import type {
	PokedexOption,
	PokemonClassification,
	TrackingStatus,
} from "@context/game";
import type {
	InfinitePagination,
	InfinitePaginationReturns,
} from "@context/shared";

import type { PokedexEntry } from "#collection:application/contracts/pokedex-entry";

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
