"use client";

import type { BrowsePokedexInput } from "@pokeatlas/core/types";
import { useInfiniteQuery } from "@tanstack/react-query";

import { browsePokedexQueryOptions } from "./api/query-options";
import { usePokedexSentinel } from "./use-pokedex-sentinel";

interface UsePokedexOptions {
	dex?: BrowsePokedexInput["dex"];
	filters?: BrowsePokedexInput["filters"];
	trainerId: string;
}

export function usePokedex({ dex, filters, trainerId }: UsePokedexOptions) {
	const {
		data,
		isFetching,
		isFetchingNextPage,
		hasNextPage,
		isPlaceholderData,
		fetchNextPage,
	} = useInfiniteQuery({
		...browsePokedexQueryOptions({ dex, filters, trainerId }),
		placeholderData: (prev) => prev,
		select: (data) => data?.pages.flatMap((page) => page.entries),
	});

	const dataIsEmpty = !isPlaceholderData && (!data || data.length === 0);
	const placeholderDataIsEmpty = isPlaceholderData && data.length === 0;

	const isLoading = (isFetching || isPlaceholderData) && !isFetchingNextPage;

	const showSkeleton = isFetching && placeholderDataIsEmpty;
	const showEmpty = !isFetching && dataIsEmpty;

	const sentinel = usePokedexSentinel({
		do: () => fetchNextPage({ cancelRefetch: false }),
		when: hasNextPage && !isFetchingNextPage,
	});

	return {
		data: data || [],
		dex,
		filters,
		isLoading,
		isLoadingMoreData: isFetchingNextPage,
		sentinel,
		showEmpty,
		showSkeleton,
	};
}
