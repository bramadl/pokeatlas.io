"use client";

import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";

import { PokedexCard } from "./pokedex-card";
import type { PokedexEntry } from "./types";

interface PokedexGridProps {
	entries: PokedexEntry[];
	hasMore: boolean;
	isBrushModeActive: boolean;
	isPending: boolean;
	onCardTap: (entry: PokedexEntry) => void;
	onLoadMore: () => void;
	totalEntries: number;
}

export function PokedexGrid({
	entries,
	hasMore,
	isPending,
	totalEntries,
	isBrushModeActive,
	onLoadMore,
	onCardTap,
}: PokedexGridProps) {
	const { ref: sentinelRef, inView } = useInView({ threshold: 0.1 });
	useEffect(() => {
		if (inView && hasMore && !isPending) onLoadMore();
	}, [inView, hasMore, isPending, onLoadMore]);

	return (
		<div className="bg-slate-50 px-8 py-4">
			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-8 gap-y-4 items-start">
				{entries.map((entry, index) => (
					<PokedexCard
						isBrushModeActive={isBrushModeActive}
						key={entry.id}
						onTap={() => onCardTap(entry)}
						pokemon={entry}
						priority={index < 12}
					/>
				))}
			</div>

			<div className="mt-4 flex items-center justify-center" ref={sentinelRef}>
				{isPending && (
					<div className="w-full flex items-center justify-center gap-8 py-8">
						<Separator className="flex-1" />
						<span className="text-sm text-muted-foreground animate-pulse inline-flex items-center gap-4">
							<Spinner /> Loading...
						</span>
						<Separator className="flex-1" />
					</div>
				)}

				{!hasMore && entries.length > 0 && (
					<div className="w-full flex items-center justify-center gap-8 py-8">
						<Separator className="flex-1" />
						<span className="text-sm text-muted-foreground">
							All {totalEntries} Pokémon loaded
						</span>
						<Separator className="flex-1" />
					</div>
				)}
			</div>
		</div>
	);
}
