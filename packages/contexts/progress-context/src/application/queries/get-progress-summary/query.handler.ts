import { type IQuery, type IResult, Result } from "@pokepulse/toolkit";

import type {
	GetProgressSummaryOutput,
	GetProgressSummaryQuery,
} from "./query";
import type { IGetProgressSummaryQueryService } from "./query.service";

export class GetProgressSummaryHandler
	implements IQuery<GetProgressSummaryQuery, GetProgressSummaryOutput>
{
	public constructor(
		private readonly queryService: IGetProgressSummaryQueryService,
	) {}

	public async execute({
		input,
	}: GetProgressSummaryQuery): Promise<IResult<GetProgressSummaryOutput>> {
		const output = await this.queryService.get(input);
		return Result.success(output);
	}
}
