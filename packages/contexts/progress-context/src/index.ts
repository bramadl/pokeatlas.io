import type { IResult } from "@pokepulse/toolkit";

import {
	type GetCatchOfTheDayHandler,
	type GetCatchOfTheDayInput,
	type GetCatchOfTheDayOutput,
	GetCatchOfTheDayQuery,
	type GetProgressSummaryHandler,
	type GetProgressSummaryInput,
	type GetProgressSummaryOutput,
	GetProgressSummaryQuery,
} from "../contracts";

export class ProgressContext {
	public constructor(
		private readonly handlers: {
			catchOfTheDay: GetCatchOfTheDayHandler;
			progressSummary: GetProgressSummaryHandler;
		},
	) {}

	public catchOfTheDay(
		input: GetCatchOfTheDayInput,
	): Promise<IResult<GetCatchOfTheDayOutput>> {
		return this.handlers.catchOfTheDay.execute(
			new GetCatchOfTheDayQuery(input),
		);
	}

	public progressSummary(
		input: GetProgressSummaryInput,
	): Promise<IResult<GetProgressSummaryOutput>> {
		return this.handlers.progressSummary.execute(
			new GetProgressSummaryQuery(input),
		);
	}
}

export * from "../contracts";
