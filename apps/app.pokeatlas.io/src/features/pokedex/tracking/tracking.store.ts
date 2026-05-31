"use client";

import { create } from "zustand";

export interface PokemonOverlay {
	inflight: number;
	trackedStates: string[];
}

interface TrackingState {
	beginTrack: (pokemonRef: string, nextStates: string[]) => void;
	getOverlayedPokemon: (pokemonRef: string) => PokemonOverlay | undefined;
	overlayedPokemonMap: Map<string, PokemonOverlay>;
	removeOverlay: (pokemonRef: string) => void;
	rollbackOverlay: (pokemonRef: string, previousStates: string[]) => void;
	settleTrack: (pokemonRef: string) => boolean;
}

export const useTrackingStore = create<TrackingState>((set, get) => ({
	beginTrack(pokemonRef, nextStates) {
		const overlayedPokemonMap = new Map(get().overlayedPokemonMap);
		const existing = overlayedPokemonMap.get(pokemonRef);

		overlayedPokemonMap.set(pokemonRef, {
			inflight: (existing?.inflight ?? 0) + 1,
			trackedStates: nextStates,
		});

		set({ overlayedPokemonMap });
	},

	getOverlayedPokemon(pokemonRef) {
		return get().overlayedPokemonMap.get(pokemonRef);
	},

	overlayedPokemonMap: new Map(),

	removeOverlay(pokemonRef) {
		const overlayedPokemonMap = new Map(get().overlayedPokemonMap);
		overlayedPokemonMap.delete(pokemonRef);
		set({ overlayedPokemonMap });
	},

	rollbackOverlay(pokemonRef, previousStates) {
		if (previousStates.length === 0) {
			const overlayedPokemonMap = new Map(get().overlayedPokemonMap);
			overlayedPokemonMap.delete(pokemonRef);
			return set({ overlayedPokemonMap });
		}

		const overlayedPokemonMap = new Map(get().overlayedPokemonMap);
		const existing = overlayedPokemonMap.get(pokemonRef);
		if (!existing) return;

		overlayedPokemonMap.set(pokemonRef, {
			inflight: Math.max(0, existing.inflight - 1),
			trackedStates: previousStates,
		});

		return set({ overlayedPokemonMap });
	},

	settleTrack(pokemonRef) {
		const overlayedPokemonMap = new Map(get().overlayedPokemonMap);

		const existing = overlayedPokemonMap.get(pokemonRef);
		if (!existing) return true;

		const newInflight = existing.inflight - 1;
		if (newInflight > 0) {
			overlayedPokemonMap.set(pokemonRef, {
				...existing,
				inflight: newInflight,
			});
			set({ overlayedPokemonMap });
			return false;
		}

		overlayedPokemonMap.set(pokemonRef, { ...existing, inflight: 0 });
		set({ overlayedPokemonMap });

		return true;
	},
}));
