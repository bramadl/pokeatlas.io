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
		if (!status) return data;
		return data.filter((pokemon) => {
			const overlayedPokemon = overlayedPokemonMap.get(pokemon.id);
			const trackedStates =
				overlayedPokemon?.trackedStates ?? pokemon.trackedStates;

			const isTracked = trackedStates.length > 0;
			if (status === "MISSING") return !isTracked;
			if (status === "TRACKED") return isTracked;
			return true;
		});
	}, [data, overlayedPokemonMap, status]);

	const hasOptimisticEmpty = entries.length === 0 && hasAnyInflights;

	return { entries, hasAnyInflights, hasOptimisticEmpty };
}
