"use client";

import { Fragment, useCallback, useState } from "react";
import { Badge } from "@/components/ui/badge";

import type { Brush } from "./brush-tool/brush";
import { BrushModeBanner } from "./brush-tool/brush-mode-banner";
import { BrushSpeedDial } from "./brush-tool/brush-speed-dial";
import { useBrush } from "./brush-tool/use-brush";
import { useBrushKeyboard } from "./brush-tool/use-brush-keyboard";
import { FORM_OPTIONS } from "./filter-tool/filter.types";
import { PokedexFilterButton } from "./filter-tool/pokedex-filter-button";
import { PokedexFilterPanel } from "./filter-tool/pokedex-filter-panel";
import { useFilter } from "./filter-tool/use-filter";
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
	const { activeFilterCount, filters, onFilterChange, onResetFilters } =
		useFilter();

	const { isSearchPending, search, onSearchChange } = useSearch(initialSearch);
	const { entries, hasMore, isPending, loadMore, track } = usePokedex({
		filters,
		initialEntries,
		initialHasMore,
		search,
	});

	const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

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

	const handleResetFilters = useCallback(() => {
		setIsFilterPanelOpen(false);
		onResetFilters();
	}, [onResetFilters]);

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
				<header className="sticky top-16 z-10 bg-white shadow p-4">
					{/* ── Toolbar row ───────────────────────────────────────── */}
					<div className="flex items-center justify-between gap-2">
						<PokedexSearch
							initialSearch={initialSearch}
							isSearchPending={isSearchPending}
							onSearchChange={onSearchChange}
						/>
						<PokedexFilterButton
							activeFilterCount={activeFilterCount}
							isOpen={isFilterPanelOpen}
							onClick={() => setIsFilterPanelOpen((v) => !v)}
						/>
					</div>

					<PokedexFilterPanel
						filters={filters}
						isVisible={isFilterPanelOpen}
						onFilterChange={onFilterChange}
						onReset={handleResetFilters}
					/>
				</header>

				<div className="relative flex items-center justify-center gap-4 mt-8 px-4">
					<div className="h-px flex-1 bg-linear-to-r from-transparent via-primary/25 to-transparent"></div>
					<Badge className="relative z-1 bg-accent border border-primary/15 text-primary h-auto py-2 px-4">
						<strong className="text-sm">
							Showing{" "}
							{FORM_OPTIONS.find((v) => v.value === filters.form)?.label} Forms
						</strong>{" "}
						<span className="text-xs">
							({new Intl.NumberFormat().format(totalEntries)})
						</span>
					</Badge>
					<div className="h-px flex-1 bg-linear-to-r from-transparent via-primary/25 to-transparent"></div>
				</div>

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
