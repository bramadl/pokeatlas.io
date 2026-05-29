"use client";

import { useCallback } from "react";

import type { Pokemon } from "@/features/pokedex/pokemon-card/card.types";

import type { Brush } from "../brush-toolbar/brush";
import { useTrackMutation } from "./use-track-mutation";

/**
 * Thin wrapper that binds trainerId into the tap callback.
 * Used by PokemonCard — receives activeBrushes from WorkspaceContext.
 */
export function useTrackPokemon(activeBrushes: Brush[], trainerId: string) {
	const { tap: mutationTap } = useTrackMutation();

	const tap = useCallback(
		(pokemon: Pokemon) => {
			mutationTap(pokemon, activeBrushes, trainerId);
		},
		[mutationTap, activeBrushes, trainerId],
	);

	return { tap };
}
