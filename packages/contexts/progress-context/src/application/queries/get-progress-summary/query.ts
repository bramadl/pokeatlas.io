import type { ProgressSummary } from "#progress:application/contracts/progress-summary.ts";

export interface GetProgressSummaryInput {
	trainerId: string;
}

export interface GetProgressSummaryOutput {
	summary: ProgressSummary;
}

export class GetProgressSummaryQuery {
	public constructor(public readonly input: GetProgressSummaryInput) {}
}
