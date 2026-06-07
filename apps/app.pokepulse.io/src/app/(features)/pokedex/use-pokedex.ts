import type { PokedexEntry } from "@pokepulse/core";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useDeferredValue, useEffect } from "react";
import { toast } from "sonner";

import { useProgressBar } from "@/hooks/use-progress-bar";

import { pokedexQueries } from "./pokedex.query";
import { pokedexQuerySelector } from "./pokedex.query-selector";
import { usePokedexSentinel } from "./use-pokedex-sentinel";

interface UsePokedexOptions {
	filters: NonNullable<
		Required<Parameters<typeof pokedexQueries.browse>[number]["filters"]>
	>;
	pokedexLimit: number;
	trackingSignature: string;
	trainerId: string;
}

export function usePokedex({
	filters,
	pokedexLimit,
	trackingSignature,
	trainerId,
}: UsePokedexOptions) {
	const query = useInfiniteQuery({
		...pokedexQueries.browse({
			filters,
			limit: pokedexLimit,
			trackingSignature,
			trainerId,
		}),
		placeholderData: (prev) => prev,
		select: (data) => {
			return pokedexQuerySelector(data, trackingSignature, filters.status);
		},
	});

	const entries =
		query.data?.pages
			.flatMap<PokedexEntry & { show: boolean }>((page) => page.entries)
			.filter((entry) => entry.show) ?? [];

	const deferredEntries = useDeferredValue(entries);
	const isDeferring = deferredEntries !== entries;

	const sentinel = usePokedexSentinel({
		do: () => query.fetchNextPage({ cancelRefetch: false }),
		when: query.hasNextPage && !query.isFetchingNextPage,
	});

	useProgressBar({
		show: { when: query.isFetching || query.isFetchingNextPage },
	});

	useEffect(() => {
		if (!query.isError) return;
		toast.error("An error occurred", {
			description: query.error?.message || "Try again later.",
		});
	}, [query.error, query.isError]);

	return {
		...query,
		entries: deferredEntries,
		isDeferring,
		sentinel,
	};
}
