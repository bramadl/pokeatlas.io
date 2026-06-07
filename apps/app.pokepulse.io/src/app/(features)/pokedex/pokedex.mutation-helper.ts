import {
	type BrowsePokedexOutput,
	type PokedexEntry,
	TrackedStateRef,
	type TrackingStatus,
} from "@pokepulse/core";
import type { InfiniteData, QueryClient } from "@tanstack/react-query";
import { produce } from "immer";
import { progressQueryKeys } from "@/app/(shared)/query-keys.registry";

import { pokedexQueryKeys } from "./pokedex.query";

export const getCachedPokedexQueries = (queryClient: QueryClient) => {
	return queryClient
		.getQueryCache()
		.findAll({ queryKey: pokedexQueryKeys.all() });
};

export const getPendingMutations = (queryClient: QueryClient) => {
	return queryClient
		.getMutationCache()
		.findAll()
		.filter((m) => m.state.status === "pending").length;
};

export const getSnapshot = (
	queryClient: QueryClient,
	pokemonRef: string,
): TrackedStateRef[] => {
	return (
		getCachedPokedexQueries(queryClient)
			.flatMap((q) => {
				const data = q.state.data as
					| InfiniteData<BrowsePokedexOutput>
					| undefined;
				return data?.pages.flatMap((p) => p.entries) ?? [];
			})
			.find((e) => e.species.id === pokemonRef)?.trackedStates ?? []
	);
};

export const injectEntryIntoCache = (
	queryClient: QueryClient,
	entry: PokedexEntry,
	targetStatus: TrackingStatus,
) => {
	for (const q of getCachedPokedexQueries(queryClient)) {
		const input = q.queryKey[2] as ReturnType<
			typeof pokedexQueryKeys.browse
		>[2];

		if (input?.filters?.status !== targetStatus) continue;
		queryClient.setQueryData<InfiniteData<BrowsePokedexOutput>>(
			q.queryKey,
			produce((draft) => {
				if (!draft) return;

				for (const page of draft.pages) {
					const entries = page.entries;
					if (entries.some((e) => e.species.id === entry.species.id)) return;

					const prevIndex = [...entries]
						.reverse()
						.findIndex((e) => e.species.dexNumber < entry.species.dexNumber);

					const insertPoint =
						prevIndex !== -1 ? entries.length - 1 - prevIndex : -1;

					if (insertPoint !== -1) {
						entries.splice(insertPoint + 1, 0, entry);
						return;
					}

					const nextIndex = entries.findIndex(
						(e) => e.species.dexNumber > entry.species.dexNumber,
					);

					if (nextIndex !== -1) {
						entries.splice(nextIndex, 0, entry);
						return;
					}
				}
			}),
		);
	}
};

export const invalidateNonAllStatusCaches = (queryClient: QueryClient) => {
	if (getPendingMutations(queryClient) === 0) {
		for (const q of getCachedPokedexQueries(queryClient)) {
			const input = q.queryKey[2] as ReturnType<
				typeof pokedexQueryKeys.browse
			>[2];

			if (input?.filters?.status === "ALL") continue;
			queryClient.invalidateQueries({
				queryKey: q.queryKey,
				refetchType: "none",
			});
		}
	}
};

export const invalidateProgressSummary = (queryClient: QueryClient) => {
	if (getPendingMutations(queryClient) === 0) {
		queryClient.invalidateQueries({
			queryKey: progressQueryKeys.all(),
		});
	}
};

export const updateEntryTrackedStates = (
	queryClient: QueryClient,
	pokemonRef: string,
	trackedStates: string[],
) => {
	for (const { queryKey } of getCachedPokedexQueries(queryClient)) {
		queryClient.setQueryData<InfiniteData<BrowsePokedexOutput>>(
			queryKey,
			produce((draft) => {
				if (!draft) return;
				for (const page of draft.pages) {
					for (const entry of page.entries) {
						if (entry.species.id !== pokemonRef) continue;
						entry.trackedStates = trackedStates.map(TrackedStateRef.from);
					}
				}
			}),
		);
	}
};

export const reconcileAfterTrack = (
	queryClient: QueryClient,
	pokemonRef: string,
	trackedStates: TrackedStateRef[],
) => {
	updateEntryTrackedStates(queryClient, pokemonRef, trackedStates);
	invalidateNonAllStatusCaches(queryClient);
	invalidateProgressSummary(queryClient);
};
