import { type IQuery, type IResult, Result } from "@pokepulse/toolkit";

import type { GetTrainerOutput, GetTrainerQuery } from "./query";
import type { IGetTrainerQueryService } from "./query.service";

export class GetTrainerHandler
	implements IQuery<GetTrainerQuery, GetTrainerOutput>
{
	public constructor(private readonly queryService: IGetTrainerQueryService) {}

	public async execute({
		input,
	}: GetTrainerQuery): Promise<IResult<GetTrainerOutput>> {
		const output = await this.queryService.get(input);
		return Result.success(output);
	}
}
