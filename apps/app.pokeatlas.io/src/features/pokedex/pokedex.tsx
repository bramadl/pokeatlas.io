"use client";

import { useMemo } from "react";

import { PokedexEmpty } from "./pokedex-empty";
import { PokedexGrid } from "./pokedex-grid";
import { PokedexSkeleton } from "./pokedex-skeleton";
import { PokedexToolbar } from "./pokedex-toolbar";
import { PokemonCard } from "./pokemon-card";
import { usePokedex } from "./use-pokedex";
import { useTrackingStore } from "./workspace/tracking/tracking.store";

export function Pokedex() {
	const { entries, filters, isLoading, sentinelRef, showEmpty, showSkeleton } =
		usePokedex();

	const overlays = useTrackingStore((s) => s.overlays);
	const status = filters?.status;

	const visibleEntries = useMemo(() => {
		if (!status) return entries;

		return entries.filter((pokemon) => {
			const overlay = overlays.get(pokemon.id);
			const currentStates = overlay?.trackedStates ?? pokemon.trackedStates;
			const isTracked = currentStates.length > 0;

			if (status === "MISSING") return !isTracked;
			if (status === "TRACKED") return isTracked;
			return true;
		});
	}, [entries, overlays, status]);

	const showOptimisticEmpty = visibleEntries.length === 0;

	return (
		<section className="container mx-auto bg-slate-50 sm:my-8">
			<PokedexToolbar />
			<PokedexGrid isLoading={isLoading}>
				{showSkeleton && <PokedexSkeleton />}
				{(showEmpty || showOptimisticEmpty) && <PokedexEmpty status={status} />}
				{visibleEntries.map((pokemon, index) => (
					<PokemonCard
						key={pokemon.id}
						pokemon={pokemon}
						shouldPreload={index <= 16}
					/>
				))}
			</PokedexGrid>
			<div ref={sentinelRef} />
		</section>
	);
}
