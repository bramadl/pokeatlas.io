import type { IResult } from "@pokeatlas/toolkit";

import type {
	BrowsePokedexInput,
	BrowsePokedexOutput,
} from "./queries/browse-pokedex/query";
import { BrowsePokedexHandler } from "./queries/browse-pokedex/query.handler";
import type { IBrowsePokedexQueryService } from "./queries/browse-pokedex/query.service";

export interface ICollectionContext {
	browsePokedex(
		input: BrowsePokedexInput,
	): Promise<IResult<BrowsePokedexOutput>>;
}

export interface CollectionContextDeps {
	queries: {
		browsePokedex: IBrowsePokedexQueryService;
	};
}

export class CollectionContext implements ICollectionContext {
	public constructor(private readonly deps: CollectionContextDeps) {}

	public async browsePokedex(
		input: BrowsePokedexInput,
	): Promise<IResult<BrowsePokedexOutput>> {
		return new BrowsePokedexHandler(this.deps.queries.browsePokedex).execute(
			input,
		);
	}
}
