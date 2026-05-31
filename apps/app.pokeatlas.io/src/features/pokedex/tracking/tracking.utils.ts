import type { BrowsePokedexOutput } from "@pokeatlas/core/types";
import type { InfiniteData, QueryClient } from "@tanstack/react-query";

import {
	BRUSH_META,
	type Brush,
	computeSignature,
} from "@/features/workspace/brush";

export type TrackingBadge = {
	isTracked: boolean;
	label: string;
	others: number;
} | null;

export function patchPokemonInAllCaches(
	queryClient: QueryClient,
	pokemonRef: string,
	confirmedStates: string[],
): void {
	queryClient.setQueriesData<InfiniteData<BrowsePokedexOutput>>(
		{ exact: false, queryKey: ["browse-pokedex"] },
		(old) => {
			if (!old) return old;

			let didPatch = false;
			const newPages = old.pages.map((page) => {
				const newEntries = page.entries.map((pokemon) => {
					if (pokemon.id !== pokemonRef) return pokemon;
					didPatch = true;
					return { ...pokemon, trackedStates: confirmedStates };
				});

				if (!didPatch) return page;
				return { ...page, entries: newEntries };
			});

			if (!didPatch) return old;
			return { ...old, pages: newPages };
		},
	);
}

export function invalidateStatusFilteredCaches(queryClient: QueryClient): void {
	queryClient.invalidateQueries({
		exact: false,
		predicate: (query) => {
			const filters = query.queryKey[2] as
				| { status?: string }
				| null
				| undefined;

			return filters?.status === "TRACKED" || filters?.status === "MISSING";
		},
		queryKey: ["browse-pokedex"],
		refetchType: "none",
	});
}

export function refetchStatusFilteredCaches(queryClient: QueryClient): void {
	queryClient.invalidateQueries({
		exact: false,
		predicate: (query) => {
			const filters = query.queryKey[2] as
				| { status?: string }
				| null
				| undefined;
			return filters?.status === "TRACKED" || filters?.status === "MISSING";
		},
		queryKey: ["browse-pokedex"],
		refetchType: "active",
	});
}

export function getTrackingBadge(
	trackedStates: string[],
	activeBrushes: Brush[],
): TrackingBadge {
	if (trackedStates.length === 0) return null;

	const isPointerMode =
		activeBrushes.length === 0 || activeBrushes.includes("eraser");

	if (isPointerMode) {
		const isBaseTracked = trackedStates.includes("BASE");
		const others = trackedStates.filter((s) => s !== "BASE").length;
		return { isTracked: isBaseTracked, label: "Base", others };
	}

	const signature = computeSignature(activeBrushes);
	const isTracked = trackedStates.includes(signature);
	const others = trackedStates.filter((s) => s !== signature).length;
	const label = activeBrushes.map((b) => BRUSH_META[b].label).join(" ");

	return { isTracked, label, others };
}
