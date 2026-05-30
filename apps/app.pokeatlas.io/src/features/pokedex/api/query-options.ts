import type {
	BrowsePokedexInput,
	BrowsePokedexOutput,
	CountPokedexInput,
	CountPokedexOutput,
} from "@pokeatlas/core/types";

import {
	type InfiniteData,
	infiniteQueryOptions,
	queryOptions,
} from "@tanstack/react-query";

import { browsePokedex, countPokedex } from "./server-actions";

export interface BrowsePokedexQueryOptions {
	dex?: BrowsePokedexInput["dex"];
	filters?: BrowsePokedexInput["filters"];
	trainerId: BrowsePokedexInput["trainerId"];
}

const LIMIT = 30;

export function browsePokedexQueryOptions({
	dex,
	filters,
	trainerId,
}: BrowsePokedexQueryOptions) {
	return infiniteQueryOptions<
		BrowsePokedexOutput,
		Error,
		InfiniteData<BrowsePokedexOutput>,
		["browse-pokedex", typeof dex, typeof filters, typeof trainerId],
		string | null
	>({
		getNextPageParam: ({ hasMore, nextCursor }) => {
			return hasMore ? (nextCursor ?? undefined) : undefined;
		},
		initialPageParam: null,
		queryFn: ({ pageParam }) => {
			return browsePokedex({
				dex,
				filters,
				pagination: { cursor: pageParam, limit: LIMIT },
				trainerId,
			});
		},
		queryKey: ["browse-pokedex", dex, filters, trainerId],
	});
}

export function countPokedexQueryOptions({
	dex,
	filters,
	trainerId,
}: {
	dex?: CountPokedexInput["dex"];
	filters?: CountPokedexInput["filters"];
	trainerId: CountPokedexInput["trainerId"];
}) {
	return queryOptions<
		CountPokedexOutput,
		Error,
		CountPokedexOutput,
		["count-pokedex", typeof dex, typeof filters, typeof trainerId]
	>({
		placeholderData: (prev) => prev,
		queryFn: () => {
			return countPokedex({
				dex,
				filters,
				trainerId,
			});
		},
		queryKey: ["count-pokedex", dex, filters, trainerId],
	});
}
