import type { PokedexEntry } from "@pokeatlas/core/types";
import { useMemo } from "react";

import { useTrackingStore } from "./workspace/tracking/tracking.store";

interface UsePokedexEntriesOptions {
	data: PokedexEntry[];
	status?: "MISSING" | "TRACKED";
}

export function usePokedexEntries({ data, status }: UsePokedexEntriesOptions) {
	const overlays = useTrackingStore((s) => s.overlays);
	const hasAnyInflights = useTrackingStore((s) => s.overlays.size > 0);

	const entries = useMemo(() => {
		if (!status) return data;
		return data.filter((pokemon) => {
			const overlay = overlays.get(pokemon.id);
			const currentStates = overlay?.trackedStates ?? pokemon.trackedStates;
			const isTracked = currentStates.length > 0;
			if (status === "MISSING") return !isTracked;
			if (status === "TRACKED") return isTracked;
			return true;
		});
	}, [data, overlays, status]);

	const hasOptimisticEmpty = entries.length === 0 && !hasAnyInflights;

	return { entries, hasAnyInflights, hasOptimisticEmpty };
}
