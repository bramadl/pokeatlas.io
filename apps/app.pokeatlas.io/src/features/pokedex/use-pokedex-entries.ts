import type { PokedexEntry } from "@pokeatlas/core/types";
import { useMemo } from "react";

import { useTrackingStore } from "./tracking/tracking.store";

interface UsePokedexEntriesOptions {
	data: PokedexEntry[];
	status?: "MISSING" | "TRACKED";
}

export function usePokedexEntries({ data, status }: UsePokedexEntriesOptions) {
	const overlayedPokemonMap = useTrackingStore((s) => s.overlayedPokemonMap);
	const hasAnyInflights = useTrackingStore(
		(s) => s.overlayedPokemonMap.size > 0,
	);

	const entries = useMemo(() => {
		const merged = data.map((pokemon) => {
			const overlay = overlayedPokemonMap.get(pokemon.id);
			if (!overlay) return pokemon;
			return { ...pokemon, trackedStates: overlay.trackedStates };
		});

		if (!status) return merged;
		return merged.filter((pokemon) => {
			const isTracked = pokemon.trackedStates.length > 0;
			if (status === "MISSING") return !isTracked;
			if (status === "TRACKED") return isTracked;
			return true;
		});
	}, [data, overlayedPokemonMap, status]);

	const hasOptimisticEmpty = entries.length === 0 && hasAnyInflights;

	return { entries, hasAnyInflights, hasOptimisticEmpty };
}
