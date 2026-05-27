import type {
	BrowsePokedexInput,
	BrowsePokedexOutput,
} from "@pokeatlas/core/types";
import { type InfiniteData, infiniteQueryOptions } from "@tanstack/react-query";

import { browsePokedex } from "./server-actions";

const LIMIT = 100;

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
		["collection:browse-pokedex", typeof dex, typeof trainerId, typeof filters],
		number
	>({
		getNextPageParam: (lastPage, _allPages, lastPageParam) => {
			if (!lastPage.hasMore) return;
			return lastPageParam + 1;
		},
		initialPageParam: 1,
		queryFn: ({ pageParam }) => {
			return browsePokedex({
				dex,
				filters,
				pagination: { limit: LIMIT, page: pageParam },
				trainerId,
			});
		},
		queryKey: ["collection:browse-pokedex", dex, trainerId, filters],
	});
}
