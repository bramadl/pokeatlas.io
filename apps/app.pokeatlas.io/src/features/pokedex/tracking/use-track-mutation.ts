"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { trackPokemon } from "@/features/global/api/server-actions";

import { useTrackingStore } from "./tracking.store";
import {
	invalidateStatusFilteredCaches,
	patchPokemonInAllCaches,
	refetchStatusFilteredCaches,
} from "./tracking.utils";

interface MutationContext {
	pokemonRef: string;
	previousStates: string[];
}

export function useTrackMutation() {
	const queryClient = useQueryClient();

	const overlayedPokemonMap = useTrackingStore((s) => s.overlayedPokemonMap);
	const beginTrack = useTrackingStore((s) => s.beginTrack);
	const getOverlayedPokemon = useTrackingStore((s) => s.getOverlayedPokemon);
	const removeOverlay = useTrackingStore((s) => s.removeOverlay);
	const rollbackOverlay = useTrackingStore((s) => s.rollbackOverlay);
	const settleTrack = useTrackingStore((s) => s.settleTrack);

	const { mutate } = useMutation<
		Awaited<ReturnType<typeof trackPokemon>>,
		Error,
		Parameters<typeof trackPokemon>[0],
		MutationContext
	>({
		mutationFn: trackPokemon,

		onError(_err, _vars, context) {
			if (!context) return;
			rollbackOverlay(context.pokemonRef, context.previousStates);
			toast.error("Something went wrong, please try again");
		},

		onMutate({ pokemonRef, trackedStates }): MutationContext {
			const flatStates = trackedStates.map((combo) => combo.join("+"));
			const existing = getOverlayedPokemon(pokemonRef);
			const previousStates = existing?.trackedStates ?? [];

			beginTrack(pokemonRef, flatStates);
			return { pokemonRef, previousStates };
		},

		onSuccess(data) {
			const { pokemonRef, trackedStates: confirmedStates } = data;

			patchPokemonInAllCaches(queryClient, pokemonRef, confirmedStates);
			invalidateStatusFilteredCaches(queryClient);

			const isLast = settleTrack(pokemonRef);
			if (isLast) {
				setTimeout(() => {
					const hasMoreInflight = overlayedPokemonMap.size > 0;
					if (!hasMoreInflight) {
						refetchStatusFilteredCaches(queryClient);
					}
					removeOverlay(pokemonRef);
				}, 100);
			}
		},
	});

	return { mutate };
}
