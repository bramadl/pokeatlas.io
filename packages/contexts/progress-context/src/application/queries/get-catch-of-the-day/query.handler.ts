import { type IQuery, type IResult, Result } from "@pokepulse/toolkit";

import type { CatchOfTheDayResetHandler } from "../../projections/catch-of-the-day/catch-of-the-day-reset.handler";
import type { GetCatchOfTheDayOutput, GetCatchOfTheDayQuery } from "./query";
import type { IGetCatchOfTheDayQueryService } from "./query.service";

export class GetCatchOfTheDayHandler
	implements IQuery<GetCatchOfTheDayQuery, GetCatchOfTheDayOutput>
{
	public constructor(
		private readonly resetHandler: CatchOfTheDayResetHandler,
		private readonly queryService: IGetCatchOfTheDayQueryService,
	) {}

	public async execute({
		input,
	}: GetCatchOfTheDayQuery): Promise<IResult<GetCatchOfTheDayOutput>> {
		await this.resetHandler.handle({
			date: input.date,
			trainerId: input.trainerId,
		});

		const output = await this.queryService.fetch(input);
		return Result.success(output);
	}
}
