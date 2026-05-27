import type { IEventBus, IResult } from "@pokeatlas/toolkit";

import {
	BrowsePokedexHandler,
	type BrowsePokedexInput,
	type BrowsePokedexOutput,
	BrowsePokedexQuery,
	type IPokedexService,
	TrackPokemonCommand,
	type TrackPokemonErrors,
	TrackPokemonHandler,
	type TrackPokemonInput,
	type TrackPokemonOutput,
} from "#application";
import type { IPokedex, IPokemonCatalog } from "#core";

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
		pokedex: IPokedexService;
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
