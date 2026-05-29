"use client";

import { useProgress } from "@bprogress/next";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { useOnInView } from "react-intersection-observer";
import { getQueryClient } from "@/lib/tanstack/query/get-query-client";
import { trainerId } from "@/lib/trainer-id";
import { browsePokedexQueryOptions } from "./api/query-options";
import { usePokedexFilterParams } from "./filters/use-filter-params";

// import { useWorkspace } from "./workspace/workspace.context";

const id = trainerId();

export function usePokedex() {
	const queryClient = getQueryClient();
	const progress = useProgress();

	// const { trainerId } = useWorkspace();
	const { debounced, raw } = usePokedexFilterParams();

	const isCached =
		queryClient.getQueryData(
			browsePokedexQueryOptions({ ...raw, trainerId: id }).queryKey,
		) !== undefined;

	const { dex, filters } = isCached ? raw : debounced;

	const {
		data,
		isFetching,
		hasNextPage,
		isFetchingNextPage,
		isPlaceholderData,
		fetchNextPage,
	} = useInfiniteQuery(
		browsePokedexQueryOptions({ dex, filters, trainerId: id }),
	);

	const entries = useMemo(
		() => data?.pages.flatMap((page) => page.entries) ?? [],
		[data],
	);

	const isLoading = useMemo(
		() => isFetching || isPlaceholderData,
		[isFetching, isPlaceholderData],
	);

	const showEmpty = !isLoading && entries.length === 0;
	const showSkeleton = isLoading && entries.length === 0;

	const sentinelRef = useOnInView(
		(inView: boolean) => {
			if (!inView || !hasNextPage || isFetchingNextPage) return;
			fetchNextPage({ cancelRefetch: false });
		},
		{ rootMargin: "0px 0px 25% 0px" },
	);

	useEffect(() => {
		if (isFetchingNextPage) progress.start(0, 0, true);
		else progress.stop();
	}, [isFetchingNextPage, progress]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: watcher only.
	useEffect(() => {
		window.scrollTo({ behavior: "smooth", top: 0 });
	}, [dex, filters]);

	return {
		dex,
		entries,
		filters,
		isLoading,
		sentinelRef,
		showEmpty,
		showSkeleton,
	};
}

// "use client";

// import { useProgress } from "@bprogress/next";
// import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
// import { useEffect, useMemo } from "react";
// import { useOnInView } from "react-intersection-observer";

// import { browsePokedexQueryOptions } from "./api/query-options";
// import { usePokedexFilterParams } from "./filters/use-filter-params";
// import { useTrackingStore } from "./workspace/tracking/tracking.store";
// import { useWorkspace } from "./workspace/workspace.context";

// export function usePokedex() {
// 	const progress = useProgress();
// 	const queryClient = useQueryClient();

// 	const { raw, debounced } = usePokedexFilterParams();
// 	const { trainerId } = useWorkspace();

// 	// True saat ada tracking mutation in-flight
// 	const hasAnyInflight = useTrackingStore((s) => s.overlays.size > 0);

// 	const isCached =
// 		queryClient.getQueryData(
// 			browsePokedexQueryOptions({ ...raw, trainerId }).queryKey,
// 		) !== undefined;

// 	const { dex, filters } = isCached ? raw : debounced;

// 	const {
// 		data,
// 		isFetching,
// 		isFetchingNextPage,
// 		hasNextPage,
// 		isPlaceholderData,
// 		fetchNextPage,
// 	} = useInfiniteQuery(browsePokedexQueryOptions({ dex, filters, trainerId }));

// 	const entries = useMemo(
// 		() => data?.pages.flatMap((page) => page.entries) ?? [],
// 		[data],
// 	);

// 	// isFilterLoading: hanya true untuk filter/dex change, BUKAN untuk:
// 	// - background refetch setelah track (hasAnyInflight)
// 	// - load more scroll (isFetchingNextPage)
// 	const isFilterLoading =
// 		(isFetching || isPlaceholderData) && !isFetchingNextPage && !hasAnyInflight;

// 	const showEmpty = !isFilterLoading && entries.length === 0;
// 	const showSkeleton = isFilterLoading && entries.length === 0;

// 	const sentinelRef = useOnInView(
// 		(inView: boolean) => {
// 			// Block fetchNextPage kalau:
// 			// - Tidak in view / tidak ada halaman berikutnya
// 			// - Sedang fetch next page (cegah double fire)
// 			// - Ada tracking mutation in-flight (cegah race antara refetch page-1 dan fetchNextPage)
// 			if (!inView || !hasNextPage || isFetchingNextPage || hasAnyInflight)
// 				return;
// 			fetchNextPage({ cancelRefetch: false });
// 		},
// 		{ rootMargin: "0px 0px 25% 0px" },
// 	);

// 	// Progress bar hanya untuk filter change
// 	useEffect(() => {
// 		if (isFilterLoading) progress.start(0, 0, true);
// 		else progress.stop();
// 	}, [isFilterLoading, progress]);

// 	// biome-ignore lint/correctness/useExhaustiveDependencies: watcher only.
// 	useEffect(() => {
// 		window.scrollTo({ behavior: "smooth", top: 0 });
// 	}, [dex, filters]);

// 	return {
// 		dex,
// 		entries,
// 		filters,
// 		isLoading: isFilterLoading,
// 		sentinelRef,
// 		showEmpty,
// 		showSkeleton,
// 	};
// }

// "use client";

// import { useProgress } from "@bprogress/next";
// import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
// import { useEffect, useMemo, useRef } from "react";
// import { useOnInView } from "react-intersection-observer";

// import { browsePokedexQueryOptions } from "./api/query-options";
// import { usePokedexFilterParams } from "./filters/use-filter-params";
// import { useTrackingStore } from "./workspace/tracking/tracking.store";
// import { useWorkspace } from "./workspace/workspace.context";

// export function usePokedex() {
// 	const progress = useProgress();
// 	const queryClient = useQueryClient();

// 	const { raw, debounced } = usePokedexFilterParams();
// 	const { trainerId } = useWorkspace();

// 	const { flushDirty } = useTrackingStore();

// 	// Track key sebelumnya untuk deteksi filter/dex change
// 	const prevKeyRef = useRef<string>("");

// 	const isCached =
// 		queryClient.getQueryData(
// 			browsePokedexQueryOptions({ ...raw, trainerId }).queryKey,
// 		) !== undefined;

// 	const { dex, filters } = isCached ? raw : debounced;

// 	// Serialized key untuk deteksi perubahan
// 	const currentKey = JSON.stringify([dex, filters]);

// 	// Lazy invalidation: saat query key berubah, flush dirty refs dulu
// 	useEffect(() => {
// 		if (prevKeyRef.current === "" || prevKeyRef.current === currentKey) {
// 			prevKeyRef.current = currentKey;
// 			return;
// 		}

// 		// Query key berubah — cek apakah ada dirty pokemon
// 		const dirty = flushDirty();
// 		prevKeyRef.current = currentKey;

// 		if (dirty.size === 0) return; // tidak ada tracking, langsung fetch dari cache

// 		// Ada dirty pokemon — invalidate semua browse-pokedex pages
// 		// (prefix match, bukan exact — supaya semua dex kena refresh)
// 		queryClient.invalidateQueries({ queryKey: ["browse-pokedex"] });
// 	}, [currentKey, flushDirty, queryClient]);

// 	const {
// 		data,
// 		isFetching,
// 		isFetchingNextPage,
// 		hasNextPage,
// 		isPlaceholderData,
// 		fetchNextPage,
// 	} = useInfiniteQuery(browsePokedexQueryOptions({ dex, filters, trainerId }));

// 	const entries = useMemo(
// 		() => data?.pages.flatMap((page) => page.entries) ?? [],
// 		[data],
// 	);

// 	// Inflight = ada overlay aktif (mutation belum settle)
// 	const hasAnyInflight = useTrackingStore((s) => s.overlays.size > 0);

// 	const isFilterLoading =
// 		(isFetching || isPlaceholderData) && !isFetchingNextPage && !hasAnyInflight;

// 	const showEmpty = !isFilterLoading && entries.length === 0;
// 	const showSkeleton = isFilterLoading && entries.length === 0;

// 	// Progress bar: filter loading ATAU load more scroll
// 	const isAnyLoading = isFetching || isPlaceholderData;

// 	const sentinelRef = useOnInView(
// 		(inView: boolean) => {
// 			// Block fetchNextPage saat mutation in-flight — cegah race
// 			if (!inView || !hasNextPage || isFetchingNextPage || hasAnyInflight)
// 				return;
// 			fetchNextPage({ cancelRefetch: false });
// 		},
// 		{ rootMargin: "0px 0px 25% 0px" },
// 	);

// 	useEffect(() => {
// 		if (isAnyLoading) progress.start(0, 0, true);
// 		else progress.stop();
// 	}, [isAnyLoading, progress]);

// 	// biome-ignore lint/correctness/useExhaustiveDependencies: watcher only.
// 	useEffect(() => {
// 		window.scrollTo({ behavior: "smooth", top: 0 });
// 	}, [dex, filters]);

// 	return {
// 		dex,
// 		entries,
// 		filters,
// 		isLoading: isFilterLoading,
// 		sentinelRef,
// 		showEmpty,
// 		showSkeleton,
// 	};
// }

// "use client";

// import { useProgress } from "@bprogress/next";
// import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
// import { useEffect, useMemo, useRef } from "react";
// import { useOnInView } from "react-intersection-observer";

// import { browsePokedexQueryOptions } from "./api/query-options";
// import { usePokedexFilterParams } from "./filters/use-filter-params";
// import { useTrackingStore } from "./workspace/tracking/tracking.store";
// import { useWorkspace } from "./workspace/workspace.context";

// export function usePokedex() {
// 	const progress = useProgress();
// 	const queryClient = useQueryClient();

// 	const { raw, debounced } = usePokedexFilterParams();
// 	const { trainerId } = useWorkspace();

// 	const { flushDirty, clearOverlay } = useTrackingStore();

// 	const prevKeyRef = useRef<string>("");

// 	const isCached =
// 		queryClient.getQueryData(
// 			browsePokedexQueryOptions({ ...raw, trainerId }).queryKey,
// 		) !== undefined;

// 	const { dex, filters } = isCached ? raw : debounced;
// 	const currentKey = JSON.stringify([dex, filters]);

// 	// Lazy invalidation: saat query key berubah, cek dirty refs
// 	useEffect(() => {
// 		if (prevKeyRef.current === "" || prevKeyRef.current === currentKey) {
// 			prevKeyRef.current = currentKey;
// 			return;
// 		}

// 		const dirty = flushDirty();
// 		prevKeyRef.current = currentKey;

// 		if (dirty.size === 0) return;

// 		// Ada dirty pokemon: invalidate dulu, tunggu refetch selesai,
// 		// baru clear semua overlay yang dirty supaya card baca data fresh
// 		queryClient.invalidateQueries({ queryKey: ["browse-pokedex"] }).then(() => {
// 			for (const ref of dirty) {
// 				clearOverlay(ref);
// 			}
// 		});
// 	}, [currentKey, flushDirty, clearOverlay, queryClient]);

// 	const {
// 		data,
// 		isFetching,
// 		isFetchingNextPage,
// 		hasNextPage,
// 		isPlaceholderData,
// 		fetchNextPage,
// 	} = useInfiniteQuery(browsePokedexQueryOptions({ dex, filters, trainerId }));

// 	const entries = useMemo(
// 		() => data?.pages.flatMap((page) => page.entries) ?? [],
// 		[data],
// 	);

// 	// inflightCount > 0 = mutation masih jalan (belum onSettled)
// 	const hasAnyInflight = useTrackingStore((s) => s.overlays.size > 0);

// 	const isFilterLoading =
// 		(isFetching || isPlaceholderData) && !isFetchingNextPage && !hasAnyInflight;

// 	const showEmpty = !isFilterLoading && entries.length === 0;
// 	const showSkeleton = isFilterLoading && entries.length === 0;

// 	const isAnyLoading = isFetching || isPlaceholderData;

// 	const sentinelRef = useOnInView(
// 		(inView: boolean) => {
// 			if (!inView || !hasNextPage || isFetchingNextPage || hasAnyInflight)
// 				return;
// 			fetchNextPage({ cancelRefetch: false });
// 		},
// 		{ rootMargin: "0px 0px 25% 0px" },
// 	);

// 	useEffect(() => {
// 		if (isAnyLoading) progress.start(0, 0, true);
// 		else progress.stop();
// 	}, [isAnyLoading, progress]);

// 	// biome-ignore lint/correctness/useExhaustiveDependencies: watcher only.
// 	useEffect(() => {
// 		window.scrollTo({ behavior: "smooth", top: 0 });
// 	}, [dex, filters]);

// 	return {
// 		dex,
// 		entries,
// 		filters,
// 		isLoading: isFilterLoading,
// 		sentinelRef,
// 		showEmpty,
// 		showSkeleton,
// 	};
// }

// "use client";

// import { useProgress } from "@bprogress/next";
// import { PokemonRef } from "@pokeatlas/core/types";
// import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
// import { useEffect, useMemo } from "react";
// import { useOnInView } from "react-intersection-observer";
// import { browsePokedexQueryOptions } from "./api/query-options";
// import { usePokedexFilterParams } from "./filters/use-filter-params";
// import type { Pokemon } from "./pokemon-card/card.types";
// import { useTrackingStore } from "./workspace/tracking/tracking.store";
// import { useWorkspace } from "./workspace/workspace.context";

// export function usePokedex() {
// 	const progress = useProgress();
// 	const queryClient = useQueryClient();

// 	const { raw, debounced } = usePokedexFilterParams();
// 	const { trainerId } = useWorkspace();

// 	// const isCached =
// 	// 	queryClient.getQueryData(
// 	// 		browsePokedexQueryOptions({ ...raw, trainerId }).queryKey,
// 	// 	) !== undefined;

// 	// const { dex, filters } = isCached ? raw : debounced;
// 	const { dex, filters } = debounced;

// 	const {
// 		data,
// 		isFetching,
// 		isFetchingNextPage,
// 		hasNextPage,
// 		isPlaceholderData,
// 		fetchNextPage,
// 	} = useInfiniteQuery(browsePokedexQueryOptions({ dex, filters, trainerId }));

// 	// const entries = useMemo(
// 	// 	() => data?.pages.flatMap((page) => page.entries) ?? [],
// 	// 	[data],
// 	// );

// 	// Pisahkan raw server entries dari augmented entries
// 	const rawEntries = useMemo(
// 		() => data?.pages.flatMap((page) => page.entries) ?? [],
// 		[data],
// 	);

// 	const overlaySnapshot = useTrackingStore((s) => s.overlays);

// 	// const entries = useMemo(() => {
// 	// 	if (filters?.status !== "TRACKED") return rawEntries;

// 	// 	const serverIds = new Set(rawEntries.map((p) => p.id));
// 	// 	const injected: Pokemon[] = [];

// 	// 	for (const [, entry] of overlaySnapshot) {
// 	// 		if (serverIds.has(entry.pokemon.id)) continue;
// 	// 		if (entry.states.length === 0) continue;
// 	// 		const isNational = !dex || dex === "NATIONAL";
// 	// 		const matchesDex = isNational || entry.pokemon.region === dex;
// 	// 		if (!matchesDex) continue;
// 	// 		injected.push(entry.pokemon);
// 	// 	}

// 	// 	return [...injected, ...rawEntries];
// 	// }, [rawEntries, filters, overlaySnapshot, dex]);

// 	const entries = rawEntries;

// 	const hasAnyInflight = useTrackingStore((s) => s.overlays.size > 0);

// 	const isLoading =
// 		(isFetching || isPlaceholderData) && !isFetchingNextPage && !hasAnyInflight; // ← tambah ini

// 	// const isLoading = (isFetching || isPlaceholderData) && !isFetchingNextPage;

// 	// showSkeleton dan showEmpty berdasarkan rawEntries (server truth),
// 	// bukan entries yang sudah di-augment dengan overlay
// 	// Hitung visible entries berdasarkan status filter
// 	// const overlaySnapshot = useTrackingStore((s) => s.overlays);

// 	const rawStatus = raw.filters?.status;

// 	const visibleCount = useMemo(() => {
// 		if (rawStatus === "TRACKED")
// 			return rawEntries.filter((p) => {
// 				const states = overlaySnapshot.get(p.id)?.states ?? p.trackedStates;
// 				return states.length > 0;
// 			}).length;

// 		if (rawStatus === "MISSING")
// 			return rawEntries.filter((p) => {
// 				const states = overlaySnapshot.get(p.id)?.states ?? p.trackedStates;
// 				return states.length === 0;
// 			}).length;

// 		return rawEntries.length;
// 	}, [rawEntries, rawStatus, overlaySnapshot]);

// 	const isTransitioning =
// 		isPlaceholderData && (filters?.status !== undefined || dex !== undefined);

// 	const showSkeleton =
// 		isLoading && (rawEntries.length === 0 || isTransitioning);
// 	const showEmpty = !isLoading && !isPlaceholderData && visibleCount === 0;

// 	// const showSkeleton =
// 	// 	(isLoading && rawEntries.length === 0) || isTransitioning;
// 	// const showEmpty = !isLoading && !isTransitioning && visibleCount === 0;
// 	// const showSkeleton =
// 	// 	isLoading && rawEntries.length === 0 && !isPlaceholderData;
// 	// const showEmpty = !isLoading && visibleCount === 0;

// 	// const entries = useMemo(() => {
// 	// 	// Kalau bukan TRACKED, return as-is
// 	// 	if (filters?.status !== "TRACKED") return rawEntries;

// 	// 	// Untuk TRACKED: inject pokemon dari overlay yang tracked
// 	// 	// tapi belum ada di server entries (belum confirmed)
// 	// 	const overlays = useTrackingStore.getState().overlays;
// 	// 	const serverIds = new Set(rawEntries.map((p) => p.id));

// 	// 	const injected: Pokemon[] = [];
// 	// 	for (const [ref, entry] of overlays) {
// 	// 		if (serverIds.has(PokemonRef.from(ref))) continue; // sudah ada dari server
// 	// 		if (entry.states.length === 0) continue; // di-untrack, skip
// 	// 		injected.push(entry.pokemon);
// 	// 	}

// 	// 	// Injected di depan supaya pokemon yang baru di-track muncul duluan
// 	// 	return [...injected, ...rawEntries];
// 	// }, [rawEntries, filters]);

// 	// Tambah ini untuk trigger re-compute saat overlay berubah
// 	// const overlaySnapshot = useTrackingStore((s) => s.overlays);

// 	// const entries = useMemo(() => {
// 	// 	if (filters?.status !== "TRACKED") return rawEntries;

// 	// 	const serverIds = new Set(rawEntries.map((p) => p.id));
// 	// 	const injected: Pokemon[] = [];

// 	// 	for (const [, entry] of overlaySnapshot) {
// 	// 		if (serverIds.has(entry.pokemon.id)) continue;
// 	// 		if (entry.states.length === 0) continue;

// 	// 		// Hanya inject kalau pokemon ini relevan dengan dex aktif
// 	// 		const isNational = !dex || dex === "NATIONAL";
// 	// 		const matchesDex = isNational || entry.pokemon.region === dex;
// 	// 		if (!matchesDex) continue;

// 	// 		injected.push(entry.pokemon);
// 	// 	}

// 	// 	return [...injected, ...rawEntries];
// 	// }, [rawEntries, filters, overlaySnapshot, dex]);

// 	// const isLoading = (isFetching || isPlaceholderData) && !isFetchingNextPage;
// 	// const showEmpty = !isLoading && entries.length === 0;
// 	// const showSkeleton = isLoading && entries.length === 0;

// 	const { hasPendingFlush, setPendingFlush, overlays } = useTrackingStore();

// 	// const sentinelRef = useOnInView(
// 	// 	async (inView: boolean) => {
// 	// 		if (!inView || !hasNextPage || isFetchingNextPage) return;

// 	// 		if (hasPendingFlush) {
// 	// 			// Ada mutation yang baru selesai — reset ke page 1, fetch fresh,
// 	// 			// lalu clear semua overlay (data dari server sudah benar)
// 	// 			setPendingFlush(false);

// 	// 			await queryClient.resetQueries({
// 	// 				queryKey: browsePokedexQueryOptions({ dex, filters, trainerId })
// 	// 					.queryKey,
// 	// 			});

// 	// 			// Clear semua overlay setelah data fresh landing
// 	// 			const store = useTrackingStore.getState();
// 	// 			const currentOverlays = new Map(store.overlays);
// 	// 			for (const ref of currentOverlays.keys()) {
// 	// 				store.removeOverlay(ref);
// 	// 			}

// 	// 			return; // resetQueries sudah trigger refetch, tidak perlu fetchNextPage
// 	// 		}

// 	// 		fetchNextPage({ cancelRefetch: false });
// 	// 	},
// 	// 	{ rootMargin: "0px 0px 25% 0px" },
// 	// );

// 	const sentinelRef = useOnInView(
// 		async (inView: boolean) => {
// 			if (!inView || !hasNextPage || isFetchingNextPage) return;

// 			if (hasPendingFlush) {
// 				setPendingFlush(false);

// 				// Invalidate dulu (background refetch, tidak hapus cache)
// 				// tunggu selesai, baru clear overlays dan append halaman berikutnya
// 				await queryClient.invalidateQueries({
// 					queryKey: browsePokedexQueryOptions({ dex, filters, trainerId })
// 						.queryKey,
// 					refetchType: "all", // refetch semua pages yang sudah di-load
// 				});

// 				// Data sudah fresh, baru clear semua overlay
// 				// const store = useTrackingStore.getState();
// 				// for (const ref of new Map(store.overlays).keys()) {
// 				// 	store.removeOverlay(ref);
// 				// }

// 				// Lanjut append halaman berikutnya seperti biasa
// 				fetchNextPage({ cancelRefetch: false });
// 				return;
// 			}

// 			fetchNextPage({ cancelRefetch: false });
// 		},
// 		{ rootMargin: "0px 0px 25% 0px" },
// 	);

// 	useEffect(() => {
// 		if (isFetching) progress.start(0, 0, true);
// 		else progress.stop();
// 	}, [isFetching, progress]);

// 	// biome-ignore lint/correctness/useExhaustiveDependencies: watcher only.
// 	useEffect(() => {
// 		window.scrollTo({ behavior: "smooth", top: 0 });
// 	}, [dex, filters]);

// 	return {
// 		dex,
// 		entries,
// 		filters,
// 		isLoading,
// 		sentinelRef,
// 		showEmpty,
// 		showSkeleton,
// 	};
// }
