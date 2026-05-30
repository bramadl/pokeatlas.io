"use client";

import type { BrowsePokedexInput } from "@pokeatlas/core/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useIsMounted } from "usehooks-ts";
import { browsePokedexQueryOptions } from "./api/query-options";
import { usePokedexSentinel } from "./use-pokedex-sentinel";

interface UsePokedexOptions {
	dex?: BrowsePokedexInput["dex"];
	filters?: BrowsePokedexInput["filters"];
	trainerId: string;
}

export function usePokedex({ dex, filters, trainerId }: UsePokedexOptions) {
	const pokedexRef = useRef({ dex, status: filters?.status });
	const {
		data,
		isFetching,
		isFetchingNextPage,
		isPlaceholderData,
		hasNextPage,
		fetchNextPage,
	} = useInfiniteQuery({
		...browsePokedexQueryOptions({ dex, filters, trainerId }),
		placeholderData: (prev) => prev,
		select: (data) => data?.pages.flatMap((page) => page.entries),
	});

	const sentinel = usePokedexSentinel({
		do: () => fetchNextPage({ cancelRefetch: false }),
		when: hasNextPage && !isFetchingNextPage,
	});

	const isLoading = (isFetching || isPlaceholderData) && !isFetchingNextPage;
	const isPokedexChanged =
		pokedexRef.current.dex !== dex ||
		pokedexRef.current.status !== filters?.status;

	const isSkeleton =
		!isFetchingNextPage &&
		isFetching &&
		(isPokedexChanged || !data || data.length === 0);

	const isEmpty =
		!isFetching && !isPlaceholderData && (!data || data.length === 0);

	const isMounted = useIsMounted();

	useEffect(() => {
		if (!isMounted()) return;
		if (!isFetching && !isPlaceholderData) {
			pokedexRef.current = { dex, status: filters?.status };
		}
	}, [isFetching, isMounted, isPlaceholderData, dex, filters?.status]);

	useEffect(() => {
		if (isPokedexChanged) window.scrollTo({ behavior: "smooth", top: 0 });
	}, [isPokedexChanged]);

	return {
		data: data || [],
		isEmpty,
		isLoading,
		isLoadingMoreData: isFetchingNextPage,
		isSkeleton,
		sentinel,
	};
}
