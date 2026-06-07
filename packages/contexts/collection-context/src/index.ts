import type { IResult } from "@pokepulse/toolkit";

import {
	type BrowsePokedexHandler,
	type BrowsePokedexInput,
	type BrowsePokedexOutput,
	BrowsePokedexQuery,
	TrackPokemonCommand,
	type TrackPokemonErrors,
	type TrackPokemonHandler,
	type TrackPokemonInput,
	type TrackPokemonOutput,
} from "../contracts";

export class CollectionContext {
	public constructor(
		private readonly handlers: {
			browsePokedex: BrowsePokedexHandler;
			trackPokemon: TrackPokemonHandler;
		},
	) {}

	public browsePokedex(
		input: BrowsePokedexInput,
	): Promise<IResult<BrowsePokedexOutput>> {
		return this.handlers.browsePokedex.execute(new BrowsePokedexQuery(input));
	}

	public trackPokemon(
		input: TrackPokemonInput,
	): Promise<IResult<TrackPokemonOutput, TrackPokemonErrors>> {
		return this.handlers.trackPokemon.execute(new TrackPokemonCommand(input));
	}
}

export * from "../contracts";
