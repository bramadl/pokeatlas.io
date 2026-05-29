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

	// Debounce bypass: if TQ already has this data cached, use raw params
	// immediately for instant feedback (no debounce delay needed).
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
	} = useInfiniteQuery(browsePokedexQueryOptions({ dex, filters, trainerId }));

	const entries = useMemo(
		() => data?.pages.flatMap((page) => page.entries) ?? [],
		[data],
	);

	// Are any mutations in-flight right now?
	// If so, suppress animate-pulse — user is tapping, not waiting for a fetch.
	const hasAnyInflight = useTrackingStore((s) => s.overlays.size > 0);

	// isLoading = "we are fetching a NEW filter/dex, not just appending pages"
	// Suppress during in-flight mutations to prevent unwanted animate-pulse.
	const isLoading =
		(isFetching || isPlaceholderData) && !isFetchingNextPage && !hasAnyInflight;

	const showSkeleton = isLoading && entries.length === 0;
	const showEmpty = !isLoading && !isPlaceholderData && entries.length === 0;

	// Sentinel for infinite scroll.
	// We do NOT block on hasAnyInflight here anymore — patchPokemonInAllCaches
	// handles cache consistency surgically, so scroll is safe to continue.
	const { ref: sentinelRef } = useInView({
		onChange: (inView) => {
			if (!inView || !hasNextPage || isFetchingNextPage) return;
			fetchNextPage({ cancelRefetch: false });
		},
		rootMargin: "0px 0px 25% 0px",
	});

	// Progress bar: show for ANY fetching (filter change or infinite scroll)
	const isAnyFetching = isFetching || isPlaceholderData;

	useEffect(() => {
		if (isAnyFetching) progress.start(0, 0, true);
		else progress.stop();
	}, [isAnyFetching, progress]);

	// Scroll to top whenever the active dex or filters change
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
