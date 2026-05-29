"use client";

import { useProgress } from "@bprogress/next";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { useInView } from "react-intersection-observer";

import { browsePokedexQueryOptions } from "./api/query-options";
import { usePokedexFilterParams } from "./filters/use-filter-params";
import { useTrackingStore } from "./workspace/tracking/tracking.store";
import { useWorkspace } from "./workspace/workspace.context";

export function usePokedex() {
	const progress = useProgress();
	const queryClient = useQueryClient();

	const { raw, debounced } = usePokedexFilterParams();
	const { trainerId } = useWorkspace();

	const isCached =
		queryClient.getQueryData(
			browsePokedexQueryOptions({ ...raw, trainerId }).queryKey,
		) !== undefined;

	const { dex, filters } = isCached ? raw : debounced;
	const {
		data,
		isFetching,
		isFetchingNextPage,
		hasNextPage,
		isPlaceholderData,
		fetchNextPage,
	} = useInfiniteQuery({
		...browsePokedexQueryOptions({ dex, filters, trainerId }),
	});

	const entries = useMemo(
		() => data?.pages.flatMap((page) => page.entries) ?? [],
		[data],
	);

	const overlays = useTrackingStore((s) => s.overlays);
	const isLoading =
		(isFetching || isPlaceholderData) &&
		!isFetchingNextPage &&
		!(overlays.size > 0);

	const visibleEntries = useMemo(() => {
		if (!filters?.status) return entries;
		return entries.filter((pokemon) => {
			const overlay = overlays.get(pokemon.id);
			const currentStates = overlay?.trackedStates ?? pokemon.trackedStates;
			const isTracked = currentStates.length > 0;
			if (filters.status === "MISSING") return !isTracked;
			if (filters.status === "TRACKED") return isTracked;
			return true;
		});
	}, [entries, overlays, filters?.status]);

	const showSkeleton = isLoading && visibleEntries.length === 0;
	const showEmpty =
		!isLoading && !isPlaceholderData && visibleEntries.length === 0;

	const isAnyFetching = isFetching || isPlaceholderData;
	useEffect(() => {
		if (isAnyFetching) progress.start(0, 0, true);
		else progress.stop();
	}, [isAnyFetching, progress]);

	const { ref: sentinelRef } = useInView({
		onChange: (inView) => {
			if (!inView || !hasNextPage || isFetchingNextPage) return;
			fetchNextPage({ cancelRefetch: false });
		},
		rootMargin: "0px 0px 25% 0px",
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: intentional watcher
	useEffect(() => {
		window.scrollTo({ behavior: "smooth", top: 0 });
	}, [dex, filters]);

	return {
		dex,
		entries,
		filters,
		isLoading,
		sentinelRef,
		showEmpty,
		showSkeleton,
	};
}
