"use client";

import { PokedexEmpty } from "./pokedex-empty";
import { PokedexGrid } from "./pokedex-grid";
import { PokedexSkeleton } from "./pokedex-skeleton";
import { PokedexToolbar } from "./pokedex-toolbar";
import { PokemonCard } from "./pokemon-card";
import { usePokedex } from "./use-pokedex";
import { usePokedexEntries } from "./use-pokedex-entries";
import { usePokedexParams } from "./use-pokedex-params";
import { usePokedexProgressBar } from "./use-pokedex-progress-bar";
import { useWorkspace } from "./workspace/workspace.context";

export function Pokedex() {
	const { trainerId } = useWorkspace();

	const { dex, filters } = usePokedexParams({ trainerId });
	const { data, isEmpty, isLoading, isLoadingMoreData, isSkeleton, sentinel } =
		usePokedex({ dex, filters, trainerId });

	const { entries, hasAnyInflights, hasOptimisticEmpty } = usePokedexEntries({
		data,
		status: filters?.status,
	});

	const isGridLoading = isLoading && !hasAnyInflights;
	const showEmpty = isEmpty && !hasAnyInflights;
	const showSkeleton = (isSkeleton || hasOptimisticEmpty) && !hasAnyInflights;

	usePokedexProgressBar({ show: { when: isGridLoading || isLoadingMoreData } });

	return (
		<section className="container mx-auto bg-slate-50 sm:my-8">
			<PokedexToolbar />
			<PokedexGrid isLoading={isGridLoading}>
				{showSkeleton ? (
					<PokedexSkeleton />
				) : showEmpty ? (
					<PokedexEmpty status={filters?.status} />
				) : (
					entries.map((pokemon, index) => (
						<PokemonCard
							key={pokemon.id}
							pokemon={pokemon}
							shouldPreload={index <= 16}
						/>
					))
				)}
			</PokedexGrid>
			<div ref={sentinel} />
		</section>
	);
}
