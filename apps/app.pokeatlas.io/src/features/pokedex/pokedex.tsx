"use client";

import { useCallback } from "react";
import type { Brush } from "./brush";
import { BrushModeBanner } from "./brush-mode-banner";
import { BrushSpeedDial } from "./brush-speed-dial";
import { PokedexGrid } from "./pokedex-grid";
import { PokedexNav } from "./pokedex-nav";
import { PokedexToolbar } from "./pokedex-toolbar";
import type { PokedexEntry } from "./types";
import { useBrush } from "./use-brush";
import { useBrushKeyboard } from "./use-brush-keyboard";
import { usePokedex } from "./use-pokedex";
import { useSearch } from "./use-search";

interface PokedexProps {
	initialEntries: PokedexEntry[];
	initialHasMore: boolean;
	initialSearch: string;
	totalEntries: number;
}

export function Pokedex({
	initialEntries,
	initialHasMore,
	initialSearch,
	totalEntries,
}: PokedexProps) {
	const { search, onSearchChange } = useSearch(initialSearch);

	const { entries, hasMore, isPending, loadMore, track } = usePokedex({
		initialEntries,
		initialHasMore,
		search,
	});

	const {
		activeBrushes,
		isOpen: isDialOpen,
		onToggleOpen,
		onBrushChange,
		computeTap,
		clearBrushes,
	} = useBrush();

	// Brush mode is "active" when the dial is open AND at least one brush is selected
	const isBrushModeActive = isDialOpen && activeBrushes.length > 0;

	// Banner is visible when dial is closed but brushes are still loaded
	const isBannerVisible = !isDialOpen && activeBrushes.length > 0;

	const handleBrushToggle = useCallback(
		(brush: Brush) => {
			const next = activeBrushes.includes(brush)
				? activeBrushes.filter((b) => b !== brush)
				: [...activeBrushes, brush];
			onBrushChange(next);
		},
		[activeBrushes, onBrushChange],
	);

	const handleCardTap = useCallback(
		async (entry: PokedexEntry) => {
			const newStates = computeTap(entry);
			if (newStates === null) return;
			await track(entry, newStates);
		},
		[computeTap, track],
	);

	const { highlightedIndex, clearHighlight } = useBrushKeyboard({
		activeBrushes,
		isBannerVisible,
		isDialOpen,
		onBrushToggle: handleBrushToggle,
		onClear: clearBrushes,
		onToggleOpen,
	});

	return (
		<main>
			<PokedexNav />

			<section className="container mx-auto py-10">
				<PokedexToolbar
					initialSearch={initialSearch}
					onSearchChange={onSearchChange}
				/>

				<BrushModeBanner
					activeBrushes={activeBrushes}
					isBannerVisible={isBannerVisible}
					onClear={clearBrushes}
				/>

				<PokedexGrid
					entries={entries}
					hasMore={hasMore}
					isBrushModeActive={isBrushModeActive}
					isPending={isPending}
					onCardTap={handleCardTap}
					onLoadMore={loadMore}
					totalEntries={totalEntries}
				/>
			</section>

			<BrushSpeedDial
				activeBrushes={activeBrushes}
				highlightedIndex={highlightedIndex}
				isOpen={isDialOpen}
				onBrushToggle={handleBrushToggle}
				onClearHighlight={clearHighlight}
				onToggle={onToggleOpen}
			/>
		</main>
	);
}
