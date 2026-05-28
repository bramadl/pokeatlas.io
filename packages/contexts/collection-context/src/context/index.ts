import {
	type BrowsePokedexHandler,
	BrowsePokedexQuery,
	type CountPokedexHandler,
	CountPokedexQuery,
} from "#application";

import type { BrowsePokedexInput, CountPokedexInput } from "#core";

export class CollectionContext {
	public constructor(
		private readonly handlers: {
			browsePokedex: BrowsePokedexHandler;
			countPokedex: CountPokedexHandler;
		},
	) {}

	public browsePokedex(input: BrowsePokedexInput) {
		return this.handlers.browsePokedex.execute(new BrowsePokedexQuery(input));
	}

	public countPokedex(input: CountPokedexInput) {
		return this.handlers.countPokedex.execute(new CountPokedexQuery(input));
	}
}
