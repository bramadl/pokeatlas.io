"use client";

import { Fragment, useCallback } from "react";

import type { Brush } from "./brush-tool/brush";
import { BrushModeBanner } from "./brush-tool/brush-mode-banner";
import { BrushSpeedDial } from "./brush-tool/brush-speed-dial";
import { useBrush } from "./brush-tool/use-brush";
import { useBrushKeyboard } from "./brush-tool/use-brush-keyboard";
import { PokedexGrid } from "./pokedex-grid";
import { PokedexSearch } from "./search-tool/pokedex-search";
import { useSearch } from "./search-tool/use-search";
import type { PokedexEntry } from "./types";
import { usePokedex } from "./use-pokedex";

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
	const { isSearchPending, search, onSearchChange } = useSearch(initialSearch);

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

	const isBannerVisible = !isDialOpen && activeBrushes.length > 0;
	const isBrushModeActive = activeBrushes.length > 0;

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
		<Fragment>
			<BrushModeBanner
				activeBrushes={activeBrushes}
				isBannerVisible={isBannerVisible}
				onClear={clearBrushes}
			/>

			<section className="container mx-auto bg-slate-50">
				<header className="sticky top-16 z-10 bg-white shadow px-4 py-4 md:px-8">
					<PokedexSearch
						initialSearch={initialSearch}
						isSearchPending={isSearchPending}
						onSearchChange={onSearchChange}
					/>
				</header>

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
		</Fragment>
	);
}
