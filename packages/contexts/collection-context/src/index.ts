import type { IResult } from "@pokepulse/toolkit";

import {
	TrackPokemonCommand,
	type TrackPokemonErrors,
	type TrackPokemonInput,
	type TrackPokemonOutput,
} from "#collection:application/commands/track-pokemon/command";
import type { TrackPokemonHandler } from "#collection:application/commands/track-pokemon/command.handler";
import {
	type BrowsePokedexInput,
	type BrowsePokedexOutput,
	BrowsePokedexQuery,
} from "#collection:application/queries/browse-pokedex/query";
import type { BrowsePokedexHandler } from "#collection:application/queries/browse-pokedex/query.handler";

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
