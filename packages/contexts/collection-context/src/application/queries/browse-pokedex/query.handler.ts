import { type IQuery, type IResult, Result } from "@pokeatlas/toolkit";

import type { BrowsePokedexOutput, IPokedex } from "#core";

import type { BrowsePokedexQuery } from "./query";

export class BrowsePokedexHandler
	implements IQuery<BrowsePokedexQuery, BrowsePokedexOutput>
{
	public constructor(private readonly pokedex: IPokedex) {}

	public async execute({
		input,
	}: BrowsePokedexQuery): Promise<IResult<BrowsePokedexOutput>> {
		const pokedex = await this.pokedex.browse(input);
		return Result.success(pokedex);
	}
}
