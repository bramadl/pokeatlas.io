import type { BrowsePokedexOutput } from "@pokepulse/core/server";
import { type InfiniteData, infiniteQueryOptions } from "@tanstack/react-query";

import {
	type BrowsePokedexQueryOptions,
	pokedexQueryKeys,
} from "@/app/(shared)/query-keys.registry";

import { browsePokedex } from "./pokedex.api";

export { type BrowsePokedexQueryOptions, pokedexQueryKeys };
export const pokedexQueries = {
	browse: ({
		limit,
		trainerId,
		filters,
		trackingSignature,
	}: BrowsePokedexQueryOptions) => {
		return infiniteQueryOptions<
			BrowsePokedexOutput,
			Error,
			InfiniteData<BrowsePokedexOutput>,
			ReturnType<typeof pokedexQueryKeys.browse>,
			string | null
		>({
			getNextPageParam: ({ hasMore, nextCursor }) => {
				return hasMore ? (nextCursor ?? undefined) : undefined;
			},
			initialPageParam: null,
			queryFn: async ({ pageParam }) => {
				return browsePokedex({
					filters,
					pagination: { cursor: pageParam, limit },
					trackingSignature,
					trainerId,
				});
			},
			queryKey: pokedexQueryKeys.browse({
				filters,
				trackingSignature,
				trainerId,
			}),
		});
	},
};
