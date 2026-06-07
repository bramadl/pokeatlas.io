import type {
	CatchOfTheDayEntry,
	GetCatchOfTheDayOutput,
} from "@context/progress";

import type { CatchOfTheDayProjectionGetPayload } from "#prisma-client/models.ts";

export type GetCatchOfTheDayQueryResult = CatchOfTheDayProjectionGetPayload<{
	select: {
		date: true;
		generatedAt: true;
		slots: true;
		trainerId: true;
	};
}>;

export function toCatchOfTheDay(
	data: GetCatchOfTheDayQueryResult,
	date: string,
): GetCatchOfTheDayOutput {
	return {
		entries: data.slots as unknown as CatchOfTheDayEntry[],
		generatedAt: data.generatedAt,
		isStale: data.date !== date,
	};
}
