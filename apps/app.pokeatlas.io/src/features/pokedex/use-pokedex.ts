"use client";

import { useCallback, useEffect, useState, useTransition } from "react";

import { loadMorePokedex, trackPokemon } from "@/app/actions";

import type { PokedexEntry } from "./types";

interface UsePokedexOptions {
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
	initialEntries,
	initialHasMore,
	search,
}: UsePokedexOptions): UsePokedexReturn {
	const [entries, setEntries] = useState(initialEntries);
	const [hasMore, setHasMore] = useState(initialHasMore);
	const [page, setPage] = useState(1);
	const [isPending, startTransition] = useTransition();

	useEffect(() => {
		setEntries(initialEntries);
		setHasMore(initialHasMore);
		setPage(1);
	}, [initialEntries, initialHasMore]);

	const loadMore = useCallback(() => {
		if (isPending || !hasMore) return;
		startTransition(async () => {
			const nextPage = page + 1;
			const data = await loadMorePokedex(nextPage, search || undefined);

			setEntries((prev) => [...prev, ...data.entries]);
			setHasMore(data.hasMore);
			setPage(nextPage);
		});
	}, [isPending, hasMore, page, search]);

	const track = useCallback(
		async (entry: PokedexEntry, newStates: string[]) => {
			setEntries((prev) =>
				prev.map((e) =>
					e.id === entry.id ? { ...e, trackedStates: newStates } : e,
				),
			);

			try {
				await trackPokemon(
					entry.id,
					newStates.map((s) => s.split("+")),
				);
			} catch {
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
