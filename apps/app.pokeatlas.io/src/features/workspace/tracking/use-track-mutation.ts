"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { toast } from "sonner";
import { trackPokemon } from "@/features/global/api/server-actions";
import type { Pokemon } from "@/features/global/definitions/pokemon";
import { applyBrushTap, type Brush, isDirty } from "../brush/brush";
import { useTrackingStore } from "./tracking.store";
import {
	invalidateStatusFilteredCaches,
	patchPokemonInAllCaches,
} from "./tracking.utils";

interface MutationContext {
	pokemonRef: string;
	previousStates: string[];
}

export function useTrackMutation() {
	const queryClient = useQueryClient();
	const store = useTrackingStore;

	const { mutate } = useMutation<
		Awaited<ReturnType<typeof trackPokemon>>,
		Error,
		Parameters<typeof trackPokemon>[0],
		MutationContext
	>({
		mutationFn: trackPokemon,

		onError(_err, _vars, context) {
			if (!context) return;
			const { pokemonRef, previousStates } = context;

			store.getState().rollbackOverlay(pokemonRef, previousStates);

			toast.error("Something went wrong, please try again");
		},

		onMutate({ pokemonRef, trackedStates }): MutationContext {
			const flatStates = trackedStates.map((combo) => combo.join("+"));

			const existing = store.getState().getOverlay(pokemonRef);
			const previousStates = existing?.trackedStates ?? [];

			store.getState().beginTrack(pokemonRef, flatStates);

			return { pokemonRef, previousStates };
		},

		onSuccess(data) {
			const { pokemonRef, trackedStates: confirmedStates } = data;

			patchPokemonInAllCaches(queryClient, pokemonRef, confirmedStates);
			invalidateStatusFilteredCaches(queryClient);

			const isLast = store.getState().settleTrack(pokemonRef);
			if (isLast) {
				setTimeout(() => {
					const hasMoreInflight = store.getState().overlays.size > 0;
					if (!hasMoreInflight) {
						queryClient.invalidateQueries({
							exact: false,
							predicate: (query) => {
								const filters = query.queryKey[2] as
									| { status?: string }
									| null
									| undefined;
								return (
									filters?.status === "TRACKED" || filters?.status === "MISSING"
								);
							},
							queryKey: ["browse-pokedex"],
							refetchType: "active",
						});
					}

					store.getState().removeOverlay(pokemonRef);
				}, 100);
			}
		},
	});

	const tap = useCallback(
		(pokemon: Pokemon, activeBrushes: Brush[], trainerId: string) => {
			const existing = store.getState().getOverlay(pokemon.id);
			const currentStates = existing?.trackedStates ?? pokemon.trackedStates;
			const nextStates = applyBrushTap(currentStates, activeBrushes);

			if (!isDirty(currentStates, nextStates)) return;

			mutate({
				pokemonRef: pokemon.id,
				trackedStates: nextStates.map((sig) =>
					sig === "BASE" ? ["BASE"] : sig.split("+"),
				),
				trainerId,
			});
		},
		[mutate],
	);

	return { tap };
}
