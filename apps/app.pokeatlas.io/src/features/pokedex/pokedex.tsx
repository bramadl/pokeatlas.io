"use client";

import { Fragment } from "react/jsx-runtime";

import { ScrollToTop } from "@/components/ui/scroll-to-top";

import { PokedexEmpty } from "./pokedex-empty";
import { PokedexGrid } from "./pokedex-grid";
import { PokedexSkeleton } from "./pokedex-skeleton";
import { PokedexToolbar } from "./pokedex-toolbar";
import { PokemonCard } from "./pokemon-card";
import { usePokedex } from "./use-pokedex";

interface PokedexProps {
	trainerId: string;
}

export function Pokedex({ trainerId }: PokedexProps) {
	const {
		entries,
		filters,
		isFetching,
		isFetchingNextPage,
		isPending,
		sentinelRef,
	} = usePokedex(trainerId);

	const isFetchingNewQuery = isFetching && !isFetchingNextPage && !isPending;

	const isSettled = !isPending && !isFetching;
	const showEmpty = isSettled && entries.length === 0;
	const showSkeleton = isFetchingNewQuery && entries.length === 0;

	return (
		<Fragment>
			<section className="container mx-auto bg-slate-50 my-8">
				<PokedexToolbar />
				<PokedexGrid isFetchingNewQuery={isFetchingNewQuery && !showSkeleton}>
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
				<div ref={sentinelRef} />
			</section>
			<ScrollToTop />
		</Fragment>
	);
}
