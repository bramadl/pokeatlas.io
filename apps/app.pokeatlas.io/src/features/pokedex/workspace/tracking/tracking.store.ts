// import { create } from "zustand";

// export interface TrackingOverlay {
// 	inflightCount: number;
// 	pendingStates: string[];
// 	scopeKey: string;
// }

// interface TrackingState {
// 	beginTrack: (
// 		pokemonRef: string,
// 		nextStates: string[],
// 		scopeKey: string,
// 	) => void;
// 	clearOverlay: (pokemonRef: string) => void;
// 	getOverlay: (pokemonRef: string) => TrackingOverlay | undefined;
// 	hasAnyInflight: () => boolean;
// 	overlays: Map<string, TrackingOverlay>;
// 	settleTrack: (
// 		pokemonRef: string,
// 	) => { done: true; scopeKey: string } | { done: false };
// 	version: number;
// }

// export const useTrackingStore = create<TrackingState>((set, get) => ({
// 	beginTrack(pokemonRef, nextStates, scopeKey) {
// 		const overlays = get().overlays;
// 		const existing = overlays.get(pokemonRef);

// 		overlays.set(pokemonRef, {
// 			inflightCount: (existing?.inflightCount ?? 0) + 1,
// 			pendingStates: nextStates,
// 			scopeKey,
// 		});

// 		set({ overlays, version: get().version + 1 });
// 	},

// 	clearOverlay(pokemonRef) {
// 		const overlays = get().overlays;
// 		overlays.delete(pokemonRef);
// 		set({ overlays, version: get().version + 1 });
// 	},

// 	getOverlay(pokemonRef) {
// 		return get().overlays.get(pokemonRef);
// 	},

// 	hasAnyInflight() {
// 		return get().overlays.size > 0;
// 	},

// 	overlays: new Map(),

// 	settleTrack(pokemonRef) {
// 		const overlays = get().overlays;
// 		const existing = overlays.get(pokemonRef);
// 		if (!existing) return { done: false };

// 		const newCount = existing.inflightCount - 1;
// 		if (newCount > 0) {
// 			overlays.set(pokemonRef, { ...existing, inflightCount: newCount });
// 			set({ overlays, version: get().version + 1 });
// 			return { done: false };
// 		}

// 		return { done: true, scopeKey: existing.scopeKey };
// 	},
// 	version: 0,
// }));

// import { create } from "zustand";

// export interface TrackingOverlay {
// 	inflightCount: number;
// 	pendingStates: string[];
// }

// interface TrackingState {
// 	beginTrack: (pokemonRef: string, nextStates: string[]) => void;
// 	clearOverlay: (pokemonRef: string) => void;
// 	// Pokemon yang sudah di-mutate dan settled, tapi belum di-invalidate.
// 	// Dipakai untuk "lazy invalidation" saat filter/dex berubah.
// 	dirtyRefs: Set<string>;
// 	flushDirty: () => Set<string>; // ambil dan reset dirtyRefs
// 	getOverlay: (pokemonRef: string) => TrackingOverlay | undefined;
// 	markDirty: (pokemonRef: string) => void;
// 	overlays: Map<string, TrackingOverlay>;
// 	settleTrack: (pokemonRef: string) => boolean; // true = last inflight
// 	version: number;
// }

// export const useTrackingStore = create<TrackingState>((set, get) => ({
// 	beginTrack(pokemonRef, nextStates) {
// 		const overlays = get().overlays;
// 		const existing = overlays.get(pokemonRef);
// 		overlays.set(pokemonRef, {
// 			inflightCount: (existing?.inflightCount ?? 0) + 1,
// 			pendingStates: nextStates,
// 		});
// 		set({ overlays, version: get().version + 1 });
// 	},

// 	clearOverlay(pokemonRef) {
// 		const overlays = get().overlays;
// 		overlays.delete(pokemonRef);
// 		set({ overlays, version: get().version + 1 });
// 	},
// 	dirtyRefs: new Set(),

// 	flushDirty() {
// 		const dirtyRefs = get().dirtyRefs;
// 		const copy = new Set(dirtyRefs);
// 		set({ dirtyRefs: new Set() });
// 		return copy;
// 	},

// 	getOverlay(pokemonRef) {
// 		return get().overlays.get(pokemonRef);
// 	},

// 	markDirty(pokemonRef) {
// 		const dirtyRefs = get().dirtyRefs;
// 		dirtyRefs.add(pokemonRef);
// 		set({ dirtyRefs });
// 	},
// 	overlays: new Map(),

// 	settleTrack(pokemonRef) {
// 		const overlays = get().overlays;
// 		const existing = overlays.get(pokemonRef);
// 		if (!existing) return true;

// 		const newCount = existing.inflightCount - 1;
// 		if (newCount > 0) {
// 			overlays.set(pokemonRef, { ...existing, inflightCount: newCount });
// 			set({ overlays, version: get().version + 1 });
// 			return false;
// 		}

// 		return true; // last inflight
// 	},
// 	version: 0,
// }));

// ––– THIS
// import { create } from "zustand";
// import type { Pokemon } from "../../pokemon-card/card.types";

// export interface TrackingEntry {
// 	pokemon: Pokemon; // full object untuk inject ke TRACKED list
// 	previousStates: string[]; // untuk rollback
// 	states: string[]; // optimistic states
// }

// interface TrackingState {
// 	getEntry: (pokemonRef: string) => TrackingEntry | undefined;
// 	hasPendingFlush: boolean;
// 	overlays: Map<string, TrackingEntry>;
// 	removeOverlay: (pokemonRef: string) => void;

// 	setOverlay: (
// 		pokemon: Pokemon,
// 		states: string[],
// 		previousStates: string[],
// 	) => void;
// 	setPendingFlush: (value: boolean) => void;
// }

// export const useTrackingStore = create<TrackingState>((set, get) => ({
// 	getEntry(pokemonRef) {
// 		return get().overlays.get(pokemonRef);
// 	},
// 	hasPendingFlush: false,
// 	overlays: new Map(),

// 	removeOverlay(pokemonRef) {
// 		const overlays = new Map(get().overlays);
// 		overlays.delete(pokemonRef);
// 		set({ overlays });
// 	},

// 	setOverlay(pokemon, states, previousStates) {
// 		const overlays = new Map(get().overlays);
// 		overlays.set(pokemon.id, { pokemon, previousStates, states });
// 		set({ overlays });
// 	},

// 	setPendingFlush(value) {
// 		set({ hasPendingFlush: value });
// 	},
// }));
