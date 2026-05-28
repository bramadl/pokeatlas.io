"use client";

import { useProgress } from "@bprogress/next";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useCallback, useDeferredValue, useEffect } from "react";
import { useOnInView } from "react-intersection-observer";

import {
	browsePokedexQueryOptions,
	countPokedexQueryOptions,
} from "./api/query-options";
import { usePokedexFilterParams } from "./filters/use-filter-params";

export function usePokedex(trainerId: string) {
	const { dex, filters } = usePokedexFilterParams();
	const progress = useProgress();

	const {
		data,
		isPending,
		isFetching,
		hasNextPage,
		isFetchingNextPage,
		isPlaceholderData,
		fetchNextPage,
	} = useInfiniteQuery(browsePokedexQueryOptions({ dex, filters, trainerId }));

	const { data: dexCount } = useQuery(
		countPokedexQueryOptions({ dex, filters, trainerId }),
	);

	const entries = data?.pages.flatMap((page) => page.entries) ?? [];

	const dexKey = dex ?? "national";
	const filtersKey = JSON.stringify(filters);

	const isFetchingNewQuery = isFetching && !isFetchingNextPage && !isPending;

	const showEmpty =
		!isPending && !isFetching && !isPlaceholderData && entries.length === 0;

	const showSkeleton = isFetchingNewQuery && entries.length === 0;

	const isLoading = (isFetchingNewQuery && !showSkeleton) || isPlaceholderData;

	// biome-ignore lint/correctness/useExhaustiveDependencies: stable string keys
	useEffect(() => {
		window.scrollTo({ behavior: "smooth", top: 0 });
	}, [dexKey, filtersKey]);

	// Progress bar
	useEffect(() => {
		if (isLoading) progress.start();
		else progress.stop();
	}, [isLoading, progress]);

	// Infinite scroll sentinel
	const sentinelRef = useOnInView(
		useCallback(
			async (inView: boolean) => {
				if (!inView || !hasNextPage || isFetchingNextPage || isFetching) return;
				await fetchNextPage({ cancelRefetch: false });
			},
			[hasNextPage, isFetchingNextPage, isFetching, fetchNextPage],
		),
		{ rootMargin: "0px 0px 80% 0px" },
	);

	return {
		dex,
		dexCount,
		entries,
		filters,
		isLoading,
		sentinelRef,
		showEmpty,
		showSkeleton,
	};
}
