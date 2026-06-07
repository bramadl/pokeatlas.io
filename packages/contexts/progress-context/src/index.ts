import type { IResult } from "@pokepulse/toolkit";

import type { GetProgressSummaryHandler } from "#progress:application/queries/get-progress-summary/query.handler.ts";
import {
	type GetProgressSummaryInput,
	type GetProgressSummaryOutput,
	GetProgressSummaryQuery,
} from "#progress:application/queries/get-progress-summary/query.ts";

export class ProgressContext {
	public constructor(
		private readonly handlers: {
			getProgressSummary: GetProgressSummaryHandler;
		},
	) {}

	public getProgressSummary(
		input: GetProgressSummaryInput,
	): Promise<IResult<GetProgressSummaryOutput>> {
		return this.handlers.getProgressSummary.execute(
			new GetProgressSummaryQuery(input),
		);
	}
}

export * from "../contracts";
