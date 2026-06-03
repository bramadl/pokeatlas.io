import type { TrackedStateRef, TrackPokemonOutput } from "@pokepulse/core";
import type { QueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import {
	pokedexMutations,
	type TrackPokemonMutationInput,
} from "./pokedex.mutation";
import {
	getSnapshot,
	injectEntryIntoCache,
	invalidateNonAllStatusCaches,
	updateEntryTrackedStates,
} from "./pokedex.mutation-helper";

interface UsePokemonTrackerOptions {
	queryClient: QueryClient;
	scope: string;
}

export function usePokedexMutation({
	queryClient,
	scope,
}: UsePokemonTrackerOptions) {
	const mutation = useMutation<
		TrackPokemonOutput,
		Error,
		TrackPokemonMutationInput,
		{ previous: TrackedStateRef[] }
	>({
		...pokedexMutations.track(),
		onError: (error, { pokemonRef }, context) => {
			toast.error("Failed to track Pokémon", {
				description: error.message || "Try again later.",
			});

			if (context?.previous) {
				updateEntryTrackedStates(queryClient, pokemonRef, context.previous);
				invalidateNonAllStatusCaches(queryClient);
			}
		},
		onMutate: ({ snapshot }) => {
			return { previous: snapshot };
		},
		onSuccess: ({ pokemonRef, trackedStates }) => {
			updateEntryTrackedStates(queryClient, pokemonRef, trackedStates);
			invalidateNonAllStatusCaches(queryClient);
		},
		scope: { id: `tracked-pokemon:${scope}` },
	});

	return {
		...mutation,
		getSnapshot,
		injectEntryIntoCache,
		invalidateNonAllStatusCaches,
		updateEntryTrackedStates,
	};
}
