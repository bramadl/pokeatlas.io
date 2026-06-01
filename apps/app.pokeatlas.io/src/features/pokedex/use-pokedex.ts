"use client";

import type { BrowsePokedexInput } from "@pokeatlas/core/types";
import { useInfiniteQuery } from "@tanstack/react-query";

import { browsePokedexQueryOptions } from "../global/api/query-options";
import { usePokedexSentinel } from "./use-pokedex-sentinel";

interface UsePokedexOptions {
	dex?: BrowsePokedexInput["dex"];
	filters?: BrowsePokedexInput["filters"];
	signature?: BrowsePokedexInput["trackingSignature"];
	trainerId: BrowsePokedexInput["trainerId"];
}

export function usePokedex({
	dex,
	filters,
	signature,
	trainerId,
}: UsePokedexOptions) {
	const {
		data,
		isFetching,
		isFetchingNextPage,
		isPlaceholderData,
		hasNextPage,
		fetchNextPage,
	} = useInfiniteQuery({
		...browsePokedexQueryOptions({
			dex,
			filters,
			...(filters && signature && { trackingSignature: signature }),
			trainerId,
		}),
		placeholderData: (prev) => prev,
		select: (data) => data?.pages.flatMap((page) => page.entries),
	});

	const isLoading = isFetching && isPlaceholderData;
	const isLoadingMoreData = isFetchingNextPage;
	const isLoadingWithEmptyPlaceholderData =
		!isFetchingNextPage && isLoading && data?.length === 0;

	const isEmpty =
		!isFetching && !isPlaceholderData && (!data || data.length === 0);

	const sentinel = usePokedexSentinel({
		do: () => fetchNextPage({ cancelRefetch: false }),
		when: hasNextPage && !isFetchingNextPage,
	});

	return {
		data: data || [],
		isEmpty,
		isLoading,
		isLoadingMoreData,
		isLoadingWithEmptyPlaceholderData,
		sentinel,
	};
}
