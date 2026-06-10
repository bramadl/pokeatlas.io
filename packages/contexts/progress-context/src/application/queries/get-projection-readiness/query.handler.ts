import { type IQuery, type IResult, Result } from "@pokepulse/toolkit";

import type {
	GetProjectionReadinessOutput,
	GetProjectionReadinessQuery,
} from "./query";
import type { IGetProjectionReadinessQueryService } from "./query.service";

export class GetProjectionReadinessHandler
	implements IQuery<GetProjectionReadinessQuery, GetProjectionReadinessOutput>
{
	public constructor(
		private readonly queryService: IGetProjectionReadinessQueryService,
	) {}

	public async execute({
		input,
	}: GetProjectionReadinessQuery): Promise<
		IResult<GetProjectionReadinessOutput>
	> {
		const output = await this.queryService.get(input);
		return Result.success(output);
	}
}
