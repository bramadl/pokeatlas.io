import type { BrowsePokedexOutput } from "@pokeatlas/core/types";
import type { InfiniteData, QueryClient } from "@tanstack/react-query";

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
