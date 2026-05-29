import {
	type BrowsePokedexHandler,
	BrowsePokedexQuery,
	type CountPokedexHandler,
	CountPokedexQuery,
	TrackPokemonCommand,
	type TrackPokemonHandler,
	type TrackPokemonInput,
} from "#application";

import type { BrowsePokedexInput, CountPokedexInput } from "#core";

export class CollectionContext {
	public constructor(
		private readonly handlers: {
			browsePokedex: BrowsePokedexHandler;
			countPokedex: CountPokedexHandler;
			trackPokemon: TrackPokemonHandler;
		},
	) {}

	public browsePokedex(input: BrowsePokedexInput) {
		return this.handlers.browsePokedex.execute(new BrowsePokedexQuery(input));
	}

	public countPokedex(input: CountPokedexInput) {
		return this.handlers.countPokedex.execute(new CountPokedexQuery(input));
	}

	public trackPokemon(input: TrackPokemonInput) {
		return this.handlers.trackPokemon.execute(new TrackPokemonCommand(input));
	}
}
