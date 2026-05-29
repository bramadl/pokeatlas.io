import type { BrowsePokedexOutput } from "@pokeatlas/core/types";
import type { InfiniteData, QueryClient } from "@tanstack/react-query";

/**
 * Surgically patch a single pokemon's trackedStates across ALL
 * cached browse-pokedex queries (every dex, every filter combination,
 * every page that's already been loaded).
 *
 * This is O(n pages in cache) in-memory — zero network, zero visual disruption.
 * No invalidation, no refetch, no animate-pulse.
 *
 * Call this in onSuccess after backend confirms the new state.
 */
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

			return {
				...old,
				pages: newPages,
			};
		},
	);
}

/**
 * Invalidate ONLY status-filtered queries (TRACKED and MISSING).
 *
 * These are the only queries where surgical patching isn't enough —
 * because when a pokemon becomes tracked/untracked, it needs to
 * appear/disappear from those filtered lists entirely.
 *
 * Don't refetch immediately — only when those queries are next accessed
 *
 * status=all queries get surgical patches instead (see above).
 *
 * Call this alongside patchPokemonInAllCaches in onSuccess.
 */
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
