import { type IQuery, type IResult, Result } from "@pokeatlas/toolkit";

import type { BrowsePokedexInput, BrowsePokedexOutput } from "./query";
import type { IBrowsePokedexQueryService } from "./query.service";

export class BrowsePokedexHandler
	implements IQuery<BrowsePokedexInput, BrowsePokedexOutput>
{
	public constructor(
		private readonly browsePokedex: IBrowsePokedexQueryService,
	) {}

	public async execute(
		input: BrowsePokedexInput,
	): Promise<IResult<BrowsePokedexOutput>> {
		const pokedex = await this.browsePokedex.from(input);
		return Result.success(pokedex);
	}
}
