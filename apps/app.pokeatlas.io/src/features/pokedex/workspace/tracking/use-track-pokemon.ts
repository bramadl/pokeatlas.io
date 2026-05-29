// "use client";

// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { useCallback } from "react";

// import { browsePokedexQueryOptions } from "@/features/pokedex/api/query-options";
// import { trackPokemon } from "@/features/pokedex/api/server-actions";
// import { usePokedexFilterParams } from "@/features/pokedex/filters/use-filter-params";
// import type { Pokemon } from "@/features/pokedex/pokemon-card/card.types";

// import { applyBrushTap, type Brush, isDirty } from "../brush-toolbar/brush";
// import { useWorkspace } from "../workspace.context";
// import { useTrackingStore } from "./tracking.store";

// interface UseTrackPokemonReturn {
// 	isPending: (pokemonRef: string) => boolean;
// 	tap: (pokemon: Pokemon) => void;
// }

// export function useTrackPokemon(activeBrushes: Brush[]): UseTrackPokemonReturn {
// 	const queryClient = useQueryClient();

// 	const { trainerId } = useWorkspace();
// 	const { raw } = usePokedexFilterParams();

// 	const { beginTrack, settleTrack, clearOverlay } = useTrackingStore();
// 	const getOverlay = useTrackingStore.getState().getOverlay;

// 	const getCurrentScopeKey = useCallback(() => {
// 		return JSON.stringify(
// 			browsePokedexQueryOptions({ ...raw, trainerId }).queryKey,
// 		);
// 	}, [raw, trainerId]);

// 	const { mutate } = useMutation({
// 		mutationFn: trackPokemon,

// 		onMutate({ pokemonRef, trackedStates }) {
// 			const flatStates = trackedStates.map((combo) => combo.join("+"));
// 			beginTrack(pokemonRef, flatStates, getCurrentScopeKey());
// 		},

// 		async onSettled(_data, _err, { pokemonRef }) {
// 			const result = settleTrack(pokemonRef);
// 			if (!result.done) return;

// 			const targetQueryKey = JSON.parse(result.scopeKey) as string[];
// 			await queryClient.invalidateQueries({
// 				exact: true,
// 				queryKey: targetQueryKey,
// 			});

// 			clearOverlay(pokemonRef);
// 		},
// 	});

// 	const tap = useCallback(
// 		(pokemon: Pokemon) => {
// 			const overlay = getOverlay(pokemon.id);
// 			const currentStates = overlay?.pendingStates ?? pokemon.trackedStates;
// 			const nextStates = applyBrushTap(currentStates, activeBrushes);

// 			if (!isDirty(currentStates, nextStates)) return;

// 			mutate({
// 				pokemonRef: pokemon.id,
// 				trackedStates: nextStates.map((sig) =>
// 					sig === "BASE" ? ["BASE"] : sig.split("+"),
// 				),
// 				trainerId,
// 			});
// 		},
// 		[activeBrushes, getOverlay, mutate, trainerId],
// 	);

// 	const isPending = useCallback((pokemonRef: string): boolean => {
// 		return (
// 			(useTrackingStore.getState().overlays.get(pokemonRef)?.inflightCount ??
// 				0) > 0
// 		);
// 	}, []);

// 	return { isPending, tap };
// }
