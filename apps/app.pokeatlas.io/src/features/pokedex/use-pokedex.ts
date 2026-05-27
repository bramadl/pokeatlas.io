"use client";

import { useProgress } from "@bprogress/next";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { useOnInView } from "react-intersection-observer";

import { browsePokedexQueryOptions } from "./api/query-options";
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
		fetchNextPage,
	} = useInfiniteQuery({
		...browsePokedexQueryOptions({ dex, filters, trainerId }),
		placeholderData: (prev) => prev,
	});

	const entries = data?.pages.flatMap((page) => page.entries) ?? [];

	const dexKey = dex ?? "national";
	const filtersKey = JSON.stringify(filters);

	// biome-ignore lint/correctness/useExhaustiveDependencies: stable string keys
	useEffect(() => {
		window.scrollTo({ behavior: "smooth", top: 0 });
	}, [dexKey, filtersKey]);

	// Progress bar
	useEffect(() => {
		if (isFetching) progress.start();
		else progress.stop();
	}, [isFetching, progress]);

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
		entries,
		filters,
		isFetching,
		isFetchingNextPage,
		isPending,
		sentinelRef,
	};
}
