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

const LIMIT = 60;

export function browsePokedexQueryOptions({
	dex,
	filters,
	trainerId,
}: {
	dex?: BrowsePokedexInput["dex"];
	filters?: BrowsePokedexInput["filters"];
	trainerId: BrowsePokedexInput["trainerId"];
}) {
	return infiniteQueryOptions<
		BrowsePokedexOutput,
		Error,
		InfiniteData<BrowsePokedexOutput>,
		["browse-pokedex", typeof dex, typeof filters, typeof trainerId],
		string | null
	>({
		getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
		initialPageParam: null,
		placeholderData: (prev) => prev,
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
