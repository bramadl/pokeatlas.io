import { type IQuery, type IResult, Result } from "@pokepulse/toolkit";

import type {
	GetProgressSummaryOutput,
	GetProgressSummaryQuery,
} from "./query";
import type { IProgressSummaryQueryService } from "./query.service";

export class GetProgressSummaryHandler
	implements IQuery<GetProgressSummaryQuery, GetProgressSummaryOutput>
{
	public constructor(
		private readonly queryService: IProgressSummaryQueryService,
	) {}

	public async execute({
		input,
	}: GetProgressSummaryQuery): Promise<IResult<GetProgressSummaryOutput>> {
		const output = await this.queryService.get(input);
		return Result.success(output);
	}
}
