import { type IQuery, type IResult, Result } from "@pokeatlas/toolkit";

import type { IPokedexQueryService } from "../../projections/queries/pokedex.query";
import type { BrowsePokedexOutput, BrowsePokedexQuery } from "./query";

export class BrowsePokedexHandler
	implements IQuery<BrowsePokedexQuery, BrowsePokedexOutput>
{
	public constructor(private readonly pokedex: IPokedexQueryService) {}

	public async execute({
		input,
	}: BrowsePokedexQuery): Promise<IResult<BrowsePokedexOutput>> {
		const pokedex = await this.pokedex.browsePokedex(input);
		return Result.success(pokedex);
	}
}
