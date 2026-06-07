import type { GetProgressSummaryOutput } from "@pokepulse/core/server";
import { queryOptions } from "@tanstack/react-query";

import {
	type GetProgressSummaryQueryOptions,
	progressQueryKeys,
} from "@/app/(shared)/query-keys.registry";

import { getProgressSummary } from "./progress.api";

export { type GetProgressSummaryQueryOptions, progressQueryKeys };
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
