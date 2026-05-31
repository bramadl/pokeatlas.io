import { TRACKABLE_STATES } from "@pokeatlas/core/types";
import { type InfiniteData, infiniteQueryOptions } from "@tanstack/react-query";

import type { BrowsePokedexInput, BrowsePokedexOutput } from "./api.contract";
import { browsePokedex } from "./server-actions";

export interface BrowsePokedexQueryOptions {
	dex?: BrowsePokedexInput["dex"];
	filters?: BrowsePokedexInput["filters"];
	trainerId: BrowsePokedexInput["trainerId"];
}

const DEFAULT_SIGNATURE = TRACKABLE_STATES.BASE;
const LIMIT = 30;

export function browsePokedexQueryOptions({
	dex,
	filters,
	trainerId,
	trackingSignature = DEFAULT_SIGNATURE,
}: Omit<BrowsePokedexInput, "pagination">) {
	return infiniteQueryOptions<
		BrowsePokedexOutput,
		Error,
		InfiniteData<BrowsePokedexOutput>,
		[
			"browse-pokedex",
			typeof trainerId,
			typeof trackingSignature,
			typeof dex,
			typeof filters,
		],
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
				trackingSignature,
				trainerId,
			});
		},
		queryKey: ["browse-pokedex", trainerId, trackingSignature, dex, filters],
	});
}
