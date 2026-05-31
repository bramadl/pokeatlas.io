"use client";

import { useCallback } from "react";

import type { Pokemon } from "@/features/global/definitions/pokemon";
import { applyBrushTap, type Brush, isDirty } from "@/features/workspace/brush";

import { useTrackingStore, useTrackMutation } from ".";

export function useTracking(activeBrushes: Brush[], trainerId: string) {
	const getOverlayedPokemon = useTrackingStore((s) => s.getOverlayedPokemon);
	const { mutate } = useTrackMutation();

	const track = useCallback(
		(pokemon: Pokemon) => {
			const existing = getOverlayedPokemon(pokemon.id);
			const currentStates = existing?.trackedStates ?? pokemon.trackedStates;
			const nextStates = applyBrushTap(currentStates, activeBrushes);

			if (!isDirty(currentStates, nextStates)) return;
			const trackedStates = nextStates.map((sig) =>
				sig === "BASE" ? ["BASE"] : sig.split("+"),
			);

			mutate({
				pokemonRef: pokemon.id,
				trackedStates,
				trainerId,
			});
		},
		[activeBrushes, getOverlayedPokemon, mutate, trainerId],
	);

	return { track };
}
