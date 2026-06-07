import { queryOptions } from "@tanstack/react-query";

import {
	type GetCatchOfTheDayQueryOptions,
	type GetProgressSummaryQueryOptions,
	progressQueryKeys,
} from "@/app/(shared)/query-keys.registry";

import { getCatchOfTheDay, getProgressSummary } from "./progress.api";
import type { GetProgressSummaryOutput } from "./progress.contract";

export { type GetProgressSummaryQueryOptions, progressQueryKeys };
export const progressQueries = {
	catchOfTheDay: (input: GetCatchOfTheDayQueryOptions) => ({
		queryFn: () => getCatchOfTheDay(input),
		queryKey: progressQueryKeys.getCatchOfTheDay(input),
		staleTime: Infinity,
	}),

	getSummary: ({ trainerId }: GetProgressSummaryQueryOptions) => {
		return queryOptions<
			GetProgressSummaryOutput,
			Error,
			GetProgressSummaryOutput,
			ReturnType<typeof progressQueryKeys.getSummary>
		>({
			queryFn: async () => getProgressSummary({ trainerId }),
			queryKey: progressQueryKeys.getSummary({ trainerId }),
			staleTime: 60 * 1000 * 60,
		});
	},
};
