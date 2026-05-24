"use client";

import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";

import { PokedexCard } from "./pokedex-card/pokedex-card";
import type { PokedexEntry } from "./types";

interface PokedexGridProps {
	entries: PokedexEntry[];
	hasMore: boolean;
	isBrushModeActive: boolean;
	isPending: boolean;
	onCardTap: (entry: PokedexEntry) => void;
	onLoadMore: () => void;
	totalEntries?: number;
}

export function PokedexGrid({
	entries,
	hasMore,
	isPending,
	isBrushModeActive,
	onLoadMore,
	onCardTap,
}: PokedexGridProps) {
	const { ref: sentinelRef, inView } = useInView({ threshold: 0.1 });
	useEffect(() => {
		if (inView && hasMore && !isPending) onLoadMore();
	}, [inView, hasMore, isPending, onLoadMore]);

	return (
		<div className="px-4 md:px-8 py-4">
			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 mg:gap-x-8 gap-y-4 items-start">
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

			{entries.length === 0 && !isPending && (
				<div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
					<div className="text-6xl select-none">🌿</div>
					<div>
						<p className="font-semibold text-foreground">
							No wild Pokémon appeared
						</p>
						<p className="text-sm text-muted-foreground mt-1">
							Try a different name, number, or family search
						</p>
					</div>
				</div>
			)}

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
			</div>
		</div>
	);
}
