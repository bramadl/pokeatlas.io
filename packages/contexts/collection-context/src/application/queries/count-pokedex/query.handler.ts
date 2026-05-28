import { type IQuery, type IResult, Result } from "@pokeatlas/toolkit";

import type { CountPokedexOutput, IPokedex } from "#core";

import type { CountPokedexQuery } from "./query";

export class CountPokedexHandler
	implements IQuery<CountPokedexQuery, CountPokedexOutput>
{
	public constructor(private readonly pokedex: IPokedex) {}

	public async execute({
		input,
	}: CountPokedexQuery): Promise<IResult<CountPokedexOutput>> {
		const total = await this.pokedex.countPokedexEntries(input);
		return Result.success(total);
	}
}
