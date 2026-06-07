import type {
	GetProgressSummaryInput,
	GetProgressSummaryOutput,
} from "@pokepulse/core/server";
import { queryOptions } from "@tanstack/react-query";

import { getProgressSummary } from "./progress.api";

export type GetProgressSummaryQueryOptions = GetProgressSummaryInput;

export const progressQueryKeys = {
	all: () => ["progress"] as const,
	getSummary: (input: GetProgressSummaryQueryOptions) => {
		return [...progressQueryKeys.all(), "summary", input] as const;
	},
};

export const progressQueries = {
	getSummary: ({ trainerId }: GetProgressSummaryQueryOptions) => {
		return queryOptions<
			GetProgressSummaryOutput,
			Error,
			GetProgressSummaryOutput,
			ReturnType<typeof progressQueryKeys.getSummary>
		>({
			queryFn: async () => getProgressSummary({ trainerId }),
			queryKey: progressQueryKeys.getSummary({ trainerId }),
		});
	},
};
