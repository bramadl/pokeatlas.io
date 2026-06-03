import { type IQuery, type IResult, Result } from "@pokepulse/toolkit";

import type { BrowsePokedexOutput, BrowsePokedexQuery } from "./query";
import type { IBrowsePokedexQueryService } from "./query.service";

export class BrowsePokedexHandler
	implements IQuery<BrowsePokedexQuery, BrowsePokedexOutput>
{
	public constructor(
		private readonly queryService: IBrowsePokedexQueryService,
	) {}

	public async execute({
		input,
	}: BrowsePokedexQuery): Promise<IResult<BrowsePokedexOutput>> {
		const output = await this.queryService.browse(input);
		return Result.success(output);
	}
}
