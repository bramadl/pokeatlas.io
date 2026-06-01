import type { BrowsePokedexInput, PokedexEntry } from "@pokeatlas/core/types";
import { useDeferredValue, useMemo } from "react";

interface UsePokedexEntriesOptions {
	data: PokedexEntry[];
	status?: NonNullable<BrowsePokedexInput["filters"]>["status"];
}

export function usePokedexEntries({ data }: UsePokedexEntriesOptions) {
	const entries = useMemo(() => {
		return data;
	}, [data]);

	const deferredEntries = useDeferredValue(entries);
	const isDeffering = deferredEntries !== entries;

	return {
		isDeffering,
		pokemon: deferredEntries,
	};
}
