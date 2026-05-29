"use client";

import { PokedexEmpty } from "./pokedex-empty";
import { PokedexGrid } from "./pokedex-grid";
import { PokedexSkeleton } from "./pokedex-skeleton";
import { PokedexToolbar } from "./pokedex-toolbar";
import { PokemonCard } from "./pokemon-card";
import { usePokedex } from "./use-pokedex";

export function Pokedex() {
	const {
		entries: visibleEntries,
		filters,
		isLoading,
		sentinelRef,
		showEmpty,
		showSkeleton,
	} = usePokedex();

	return (
		<section className="container mx-auto bg-slate-50 sm:my-8">
			<PokedexToolbar />
			<PokedexGrid isLoading={isLoading}>
				{showSkeleton && <PokedexSkeleton />}
				{showEmpty && <PokedexEmpty status={filters?.status} />}
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
