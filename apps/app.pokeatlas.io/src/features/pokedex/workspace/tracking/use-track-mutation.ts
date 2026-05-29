// "use client"; --- VERSION ONE

// import { useMutation } from "@tanstack/react-query";
// import { useCallback } from "react";

// import { trackPokemon } from "@/features/pokedex/api/server-actions";
// import type { Pokemon } from "@/features/pokedex/pokemon-card/card.types";
// import { applyBrushTap, type Brush, isDirty } from "../brush-toolbar/brush";
// import { useTrackingStore } from "./tracking.store";

// export function useTrackMutation() {
// 	const { beginTrack, settleTrack, clearOverlay, markDirty } =
// 		useTrackingStore();

// 	const { mutate } = useMutation({
// 		mutationFn: trackPokemon,

// 		onMutate({ pokemonRef, trackedStates }) {
// 			const flatStates = trackedStates.map((combo) => combo.join("+"));
// 			beginTrack(pokemonRef, flatStates);
// 		},

// 		onSettled(_data, _err, { pokemonRef }) {
// 			const isLast = settleTrack(pokemonRef);
// 			if (!isLast) return;

// 			// Tandai sebagai dirty (perlu sync) tapi TIDAK invalidate sekarang.
// 			// Invalidation terjadi lazy — saat user ganti filter/dex di usePokedex.
// 			markDirty(pokemonRef);
// 			clearOverlay(pokemonRef);
// 		},
// 	});

// 	const tap = useCallback(
// 		(pokemon: Pokemon, activeBrushes: Brush[], trainerId: string) => {
// 			const overlay = useTrackingStore.getState().getOverlay(pokemon.id);
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
// 		[mutate],
// 	);

// 	return { tap };
// }

// "use client"; --- VERSION TWO

// import { useMutation } from "@tanstack/react-query";
// import { useCallback } from "react";

// import { trackPokemon } from "@/features/pokedex/api/server-actions";
// import type { Pokemon } from "@/features/pokedex/pokemon-card/card.types";
// import { applyBrushTap, type Brush, isDirty } from "../brush-toolbar/brush";
// import { useTrackingStore } from "./tracking.store";

// export function useTrackMutation() {
// 	const { beginTrack, settleTrack, markDirty } = useTrackingStore();
// 	// clearOverlay sengaja TIDAK diambil di sini

// 	const { mutate } = useMutation({
// 		mutationFn: trackPokemon,

// 		onMutate({ pokemonRef, trackedStates }) {
// 			const flatStates = trackedStates.map((combo) => combo.join("+"));
// 			beginTrack(pokemonRef, flatStates);
// 		},

// 		onSettled(_data, _err, { pokemonRef }) {
// 			const isLast = settleTrack(pokemonRef);
// 			if (!isLast) return;

// 			// Hanya markDirty — overlay TETAP HIDUP.
// 			// Card akan terus baca dari overlay (yang sudah benar)
// 			// sampai user ganti filter/dex dan flushDirty() dipanggil.
// 			markDirty(pokemonRef);

// 			// TIDAK clearOverlay di sini. clearOverlay dipanggil di usePokedex
// 			// setelah invalidation selesai dan data fresh sudah landing.
// 		},
// 	});

// 	const tap = useCallback(
// 		(pokemon: Pokemon, activeBrushes: Brush[], trainerId: string) => {
// 			const overlay = useTrackingStore.getState().getOverlay(pokemon.id);
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
// 		[mutate],
// 	);

// 	return { tap };
// }

// "use client"; ––– THIS IS THE LATEST ONE SMH!

// import { useMutation } from "@tanstack/react-query";
// import { useCallback } from "react";
// import { toast } from "sonner";

// import { trackPokemon } from "@/features/pokedex/api/server-actions";
// import type { Pokemon } from "@/features/pokedex/pokemon-card/card.types";
// import { getQueryClient } from "@/lib/tanstack/query/get-query-client";
// import { applyBrushTap, type Brush, isDirty } from "../brush-toolbar/brush";
// import { useTrackingStore } from "./tracking.store";

// export function useTrackMutation() {
// 	const queryClient = getQueryClient();

// 	const { setOverlay, removeOverlay, getEntry, setPendingFlush } =
// 		useTrackingStore();

// 	const { mutate } = useMutation({
// 		mutationFn: trackPokemon,

// 		onError(_err, _vars, context) {
// 			if (!context) return;
// 			const { pokemonRef, previousStates } = context;

// 			const existing = useTrackingStore.getState().getEntry(pokemonRef);
// 			if (!existing) return;

// 			if (previousStates.length === 0) {
// 				// Sebelumnya tidak tracked sama sekali → remove overlay
// 				removeOverlay(pokemonRef);
// 			} else {
// 				// Rollback ke previous states
// 				setOverlay(existing.pokemon, previousStates, []);
// 			}

// 			toast.error("Gagal menyimpan. Coba lagi.");
// 		},

// 		onMutate({ pokemonRef, trackedStates }) {
// 			// previousStates diambil dari entry yang ada (rapid tap) atau kosong
// 			const existing = useTrackingStore.getState().getEntry(pokemonRef);
// 			const previousStates = existing?.states ?? [];

// 			// Kita butuh pokemon object — dipass via mutate variables
// 			// tapi mutationFn hanya terima { pokemonRef, trackedStates, trainerId }
// 			// jadi kita simpan via context trick di bawah
// 			const flatStates = trackedStates.map((combo) => combo.join("+"));

// 			return { flatStates, pokemonRef, previousStates };
// 		},

// 		// onSuccess(_data, { pokemonRef }) {
// 		// 	setPendingFlush(true);
// 		// },

// 		// onSuccess(_data, { pokemonRef }) {
// 		// 	setPendingFlush(true);

// 		// 	// Invalidate TRACKED query untuk semua dex
// 		// 	// supaya saat user pindah ke TRACKED, data sudah fresh
// 		// 	queryClient.invalidateQueries({
// 		// 		predicate: (query) => {
// 		// 			const key = query.queryKey as unknown[];
// 		// 			const filters = key[2] as { status?: string } | undefined;
// 		// 			return filters?.status === "TRACKED" || filters?.status === "MISSING";
// 		// 		},
// 		// 		queryKey: ["browse-pokedex"],
// 		// 	});
// 		// },
// 		onSuccess(_data, { pokemonRef }) {
// 			setPendingFlush(true);

// 			queryClient.invalidateQueries({
// 				predicate: (query) => {
// 					const key = query.queryKey as unknown[];
// 					const filters = key[2] as { status?: string } | undefined;
// 					// Invalidate TRACKED, MISSING, DAN ALL (status undefined)
// 					return (
// 						filters?.status === "TRACKED" ||
// 						filters?.status === "MISSING" ||
// 						filters?.status === undefined
// 					);
// 				},
// 				queryKey: ["browse-pokedex"],
// 			});
// 		},
// 	});

// 	const tap = useCallback(
// 		(pokemon: Pokemon, activeBrushes: Brush[], trainerId: string) => {
// 			const existing = getEntry(pokemon.id);
// 			const currentStates = existing?.states ?? pokemon.trackedStates;
// 			const nextStates = applyBrushTap(currentStates, activeBrushes);

// 			if (!isDirty(currentStates, nextStates)) return;

// 			// Set overlay sebelum mutate supaya onMutate bisa akses previousStates
// 			const previousStates = currentStates;
// 			const flatNext = nextStates.map((sig) =>
// 				sig === "BASE" ? ["BASE"] : sig.split("+"),
// 			);

// 			// Set overlay dulu (optimistic)
// 			setOverlay(pokemon, nextStates, previousStates);

// 			mutate({ pokemonRef: pokemon.id, trackedStates: flatNext, trainerId });
// 		},
// 		[mutate, getEntry, setOverlay],
// 	);

// 	return { tap };
// }
