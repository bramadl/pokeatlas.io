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
	const { entries, filters, isLoading, sentinelRef, showEmpty, showSkeleton } =
		usePokedex(trainerId);

	function PokedexScreen() {
		if (showSkeleton) return <PokedexSkeleton />;
		if (showEmpty) return <PokedexEmpty status={filters?.status} />;
		return entries.map((pokemon, index) => (
			<PokemonCard
				key={pokemon.id}
				pokemon={pokemon}
				shouldPreload={index <= 16}
			/>
		));
	}

	return (
		<Fragment>
			<section className="container mx-auto bg-slate-50 my-8">
				<PokedexToolbar />
				<PokedexGrid isLoading={isLoading}>
					<PokedexScreen />
				</PokedexGrid>
				<div ref={sentinelRef} />
			</section>
			<ScrollToTop />
		</Fragment>
	);
}
