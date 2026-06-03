import type {
	BrowsePokedexInput,
	BrowsePokedexOutput,
} from "@pokeatlas/core/server";
import { type InfiniteData, infiniteQueryOptions } from "@tanstack/react-query";

import { browsePokedex } from "./pokedex.api";

export type BrowsePokedexQueryOptions = Omit<
	BrowsePokedexInput,
	"pagination"
> & { limit: number };

export const pokedexQueryKeys = {
	all: () => ["pokedex"] as const,
	browse: (input: Omit<BrowsePokedexQueryOptions, "limit">) => {
		return [...pokedexQueryKeys.all(), "browse", input] as const;
	},
};

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
