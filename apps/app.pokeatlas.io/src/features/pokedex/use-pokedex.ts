"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { loadMorePokedex } from "@/app/actions";
import type { PokedexFilters } from "./filter-tool/filter.types";
import type { PokedexEntry } from "./types";

interface UsePokedexOptions {
	filters: PokedexFilters;
	initialEntries: PokedexEntry[];
	initialHasMore: boolean;
	search: string;
}

interface UsePokedexReturn {
	entries: PokedexEntry[];
	hasMore: boolean;
	isPending: boolean;
	loadMore: () => void;
	track: (entry: PokedexEntry, newStates: string[]) => Promise<void>;
}

export function usePokedex({
	filters,
	initialEntries,
	initialHasMore,
	search,
}: UsePokedexOptions): UsePokedexReturn {
	const [entries, setEntries] = useState(initialEntries);
	const [hasMore, setHasMore] = useState(initialHasMore);
	const [page, setPage] = useState(1);
	const [isPending, startTransition] = useTransition();

	// Reset when search or filters change (new SSR render resets initialEntries)
	useEffect(() => {
		setEntries(initialEntries);
		setHasMore(initialHasMore);
		setPage(1);
	}, [initialEntries, initialHasMore]);

	const loadMore = useCallback(() => {
		const nextPage = page + 1;
		startTransition(async () => {
			const result = await loadMorePokedex(nextPage, search, filters);
			setEntries((prev) => {
				const existingIds = new Set(prev.map((e) => e.id));
				const deduped = result.entries.filter((e) => !existingIds.has(e.id));
				return [...prev, ...deduped];
			});
			setHasMore(result.hasMore);
			setPage(nextPage);
		});
	}, [page, search, filters]);

	const track = useCallback(
		async (entry: PokedexEntry, newStates: string[]) => {
			const { trackPokemon } = await import("@/app/actions");

			setEntries((prev) =>
				prev.map((e) =>
					e.id === entry.id ? { ...e, trackedStates: newStates } : e,
				),
			);

			try {
				const combos = newStates.map((sig) => sig.split("+"));
				await trackPokemon(entry.id, combos);
			} catch (error) {
				const msg = (error as Error).message;
				toast.error("Failed to mark the pokemon", { description: msg });
				setEntries((prev) =>
					prev.map((e) =>
						e.id === entry.id
							? { ...e, trackedStates: entry.trackedStates }
							: e,
					),
				);
			}
		},
		[],
	);

	return { entries, hasMore, isPending, loadMore, track };
}
