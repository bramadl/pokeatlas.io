import type { IEventBus, IResult } from "@pokeatlas/toolkit";

import type { IPokedex } from "../core/pokedex";
import type { IPokemonCatalog } from "../core/pokemon-catalog";
import {
	TrackPokemonCommand,
	type TrackPokemonErrors,
	type TrackPokemonInput,
	type TrackPokemonOutput,
} from "./commands/track-pokemon/command";
import { TrackPokemonHandler } from "./commands/track-pokemon/command.handler";
import type { IPokedexQueryService } from "./projections/queries/pokedex.query";
import {
	type BrowsePokedexInput,
	type BrowsePokedexOutput,
	BrowsePokedexQuery,
} from "./queries/browse-pokedex/query";
import { BrowsePokedexHandler } from "./queries/browse-pokedex/query.handler";

export interface ICollectionContext {
	browsePokedex(
		input: BrowsePokedexInput,
	): Promise<IResult<BrowsePokedexOutput>>;
	trackPokemon(
		input: TrackPokemonInput,
	): Promise<IResult<TrackPokemonOutput, TrackPokemonErrors>>;
}

export interface CollectionContextDeps {
	eventBus: IEventBus;
	queries: {
		pokedex: IPokedexQueryService;
		pokemonCatalog: IPokemonCatalog;
	};
	repositories: {
		pokedex: IPokedex;
	};
}

export class CollectionContext implements ICollectionContext {
	public constructor(private readonly deps: CollectionContextDeps) {}

	public async browsePokedex(
		input: BrowsePokedexInput,
	): Promise<IResult<BrowsePokedexOutput>> {
		return new BrowsePokedexHandler(this.deps.queries.pokedex).execute(
			new BrowsePokedexQuery(input),
		);
	}

	public async trackPokemon(
		input: TrackPokemonInput,
	): Promise<IResult<TrackPokemonOutput, TrackPokemonErrors>> {
		return new TrackPokemonHandler(
			this.deps.eventBus,
			this.deps.queries.pokemonCatalog,
			this.deps.repositories.pokedex,
		).execute(new TrackPokemonCommand(input));
	}
}
