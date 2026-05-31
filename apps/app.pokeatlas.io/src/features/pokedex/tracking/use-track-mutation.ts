"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { trackPokemon } from "@/features/global/api/server-actions";
import { isDirty } from "@/features/workspace/brush";

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

type TrackPokemonParams = Parameters<typeof trackPokemon>[0];

interface TrackPokemonInput extends TrackPokemonParams {
	_confirmedStates?: string[];
}

export function useTrackMutation(trainerId: string) {
	const queryClient = useQueryClient();

	const beginTrack = useTrackingStore((s) => s.beginTrack);
	const getOverlayedPokemon = useTrackingStore((s) => s.getOverlayedPokemon);
	const removeOverlay = useTrackingStore((s) => s.removeOverlay);
	const rollbackOverlay = useTrackingStore((s) => s.rollbackOverlay);
	const settleTrack = useTrackingStore((s) => s.settleTrack);

	const { mutate } = useMutation<
		Awaited<ReturnType<typeof trackPokemon>>,
		Error,
		TrackPokemonInput,
		MutationContext
	>({
		mutationFn: ({ _confirmedStates: _, ...params }) => trackPokemon(params),

		onError(_err, _vars, context) {
			if (!context) return;
			rollbackOverlay(context.pokemonRef, context.previousStates);
			toast.error("Something went wrong, please try again");
		},

		onMutate({ pokemonRef, trackedStates, _confirmedStates }): MutationContext {
			const flatStates = trackedStates.map((combo) => combo.join("+"));
			const previousStates =
				_confirmedStates ??
				getOverlayedPokemon(pokemonRef)?.trackedStates ??
				[];

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
					const currentOverlay = useTrackingStore
						.getState()
						.overlayedPokemonMap.get(pokemonRef);

					if (
						currentOverlay &&
						isDirty(confirmedStates, currentOverlay.trackedStates)
					) {
						const trackedStates = currentOverlay.trackedStates.map((sig) =>
							sig === "BASE" ? ["BASE"] : sig.split("+"),
						);

						mutate({
							_confirmedStates: confirmedStates,
							pokemonRef,
							trackedStates,
							trainerId,
						});
					} else {
						removeOverlay(pokemonRef);
						const hasMoreInflight =
							useTrackingStore.getState().overlayedPokemonMap.size > 0;

						if (!hasMoreInflight) refetchStatusFilteredCaches(queryClient);
					}
				}, 100);
			}
		},
	});

	return { mutate };
}
