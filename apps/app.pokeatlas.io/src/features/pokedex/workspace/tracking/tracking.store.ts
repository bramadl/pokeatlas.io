"use client";

import { create } from "zustand";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OverlayEntry {
	/**
	 * Number of in-flight mutations for this pokemon.
	 * Overlay stays alive as long as inflight > 0.
	 */
	inflight: number;
	/**
	 * Optimistic tracked states — what the card should show right now.
	 * Always reflects the LATEST tap intent, even mid rapid-tap.
	 */
	trackedStates: string[];
}

interface TrackingState {
	/**
	 * Set or update an overlay for a pokemon.
	 * Increments inflight counter. Always overwrites trackedStates
	 * with the latest intent (last-write-wins for UI).
	 */
	beginTrack: (pokemonRef: string, nextStates: string[]) => void;

	/** Read current overlay for a pokemon (undefined = no overlay). */
	getOverlay: (pokemonRef: string) => OverlayEntry | undefined;
	overlays: Map<string, OverlayEntry>;

	/**
	 * Remove the overlay entirely. Call only after settleTrack returns true
	 * AND the TQ cache has been patched with confirmed server data.
	 */
	removeOverlay: (pokemonRef: string) => void;

	/**
	 * Rollback overlay to a previous state on error.
	 * If previousStates is empty, removes the overlay entirely.
	 */
	rollbackOverlay: (pokemonRef: string, previousStates: string[]) => void;

	/**
	 * Decrement inflight for a pokemon after a mutation settles.
	 * Returns true if this was the last in-flight mutation.
	 * Does NOT remove the overlay — caller decides when to remove.
	 */
	settleTrack: (pokemonRef: string) => boolean;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useTrackingStore = create<TrackingState>((set, get) => ({
	beginTrack(pokemonRef, nextStates) {
		const overlays = new Map(get().overlays);
		const existing = overlays.get(pokemonRef);

		overlays.set(pokemonRef, {
			inflight: (existing?.inflight ?? 0) + 1,
			trackedStates: nextStates,
		});

		set({ overlays });
	},

	getOverlay(pokemonRef) {
		return get().overlays.get(pokemonRef);
	},
	overlays: new Map(),

	removeOverlay(pokemonRef) {
		const overlays = new Map(get().overlays);
		overlays.delete(pokemonRef);
		set({ overlays });
	},

	rollbackOverlay(pokemonRef, previousStates) {
		if (previousStates.length === 0) {
			const overlays = new Map(get().overlays);
			overlays.delete(pokemonRef);
			return set({ overlays });
		}

		const overlays = new Map(get().overlays);
		const existing = overlays.get(pokemonRef);
		if (!existing) return;

		overlays.set(pokemonRef, {
			inflight: Math.max(0, existing.inflight - 1),
			trackedStates: previousStates,
		});

		return set({ overlays });
	},

	settleTrack(pokemonRef) {
		const overlays = new Map(get().overlays);

		const existing = overlays.get(pokemonRef);
		if (!existing) return true;

		const newInflight = existing.inflight - 1;
		if (newInflight > 0) {
			overlays.set(pokemonRef, { ...existing, inflight: newInflight });
			set({ overlays });
			return false;
		}

		overlays.set(pokemonRef, { ...existing, inflight: 0 });
		set({ overlays });
		return true;
	},
}));
