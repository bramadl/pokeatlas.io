"use client";

import {
	useDeferredValue,
	// useMemo
} from "react";

import { PokedexEmpty } from "./pokedex-empty";
import { PokedexEntryLog } from "./pokedex-entry-log";
import { PokedexGrid } from "./pokedex-grid";
import { PokedexSkeleton } from "./pokedex-skeleton";
import { PokedexToolbar } from "./pokedex-toolbar";
import { PokemonCard } from "./pokemon/card";
import { usePokedex } from "./use-pokedex";

import { getActivePrimitives } from "./workspace/brush/brush";
import { useTrackingStore } from "./workspace/tracking/tracking.store";
import { useTrackPokemon } from "./workspace/tracking/use-track-pokemon";
import { useWorkspace } from "./workspace/workspace.context";

interface PokedexScreenProps {
	children: React.ReactNode;
	emptyStatus?: "MISSING" | "TRACKED";
	showEmpty: boolean;
	showSkeleton: boolean;
}

function PokedexScreen({
	children,
	emptyStatus,
	showEmpty,
	showSkeleton,
}: PokedexScreenProps) {
	if (showSkeleton) return <PokedexSkeleton />;
	if (showEmpty) return <PokedexEmpty status={emptyStatus} />;
	return children;
}

export function Pokedex() {
	const {
		entries: visibleEntries,
		filters,
		isLoading,
		sentinelRef,
		showEmpty,
		showSkeleton,
	} = usePokedex();

	const { activeBrushes, trainerId } = useWorkspace();
	const { tap } = useTrackPokemon(activeBrushes, trainerId);
	const overlays = useTrackingStore((s) => s.overlays);

	const entries = useDeferredValue(visibleEntries);
	return (
		<section className="container mx-auto bg-slate-50 sm:my-8">
			<PokedexToolbar />
			<PokedexGrid isLoading={isLoading}>
				<PokedexScreen
					emptyStatus={filters?.status}
					showEmpty={showEmpty}
					showSkeleton={showSkeleton}
				>
					{entries.map((p, index) => {
						const overlay = overlays.get(p.id);
						const pokemon = {
							...p,
							trackedStates: overlay?.trackedStates ?? p.trackedStates,
						};

						const pokemonHasShinyState = getActivePrimitives(
							pokemon.trackedStates,
						).has("SHINY");

						return (
							<PokemonCard
								CardContext={PokedexEntryLog}
								key={p.id}
								onTap={() => tap(pokemon)}
								pokemon={pokemon}
								pokemonHasShinyState={pokemonHasShinyState}
								shouldPreload={index <= 16}
							/>
						);
					})}
				</PokedexScreen>
			</PokedexGrid>
			<div ref={sentinelRef} />
		</section>
	);
}
