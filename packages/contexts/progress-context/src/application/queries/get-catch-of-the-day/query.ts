import type { CatchOfTheDayEntry } from "#progress:application/contracts/catch-of-the-day";

export interface GetCatchOfTheDayInput {
	date: string;
	trainerId: string;
}

export interface GetCatchOfTheDayOutput {
	entries: CatchOfTheDayEntry[];
	generatedAt: Date;
	isStale: boolean;
}

export class GetCatchOfTheDayQuery {
	public constructor(public readonly input: GetCatchOfTheDayInput) {}
}
