"use client";

import type { PokedexEntry } from "@pokeatlas/core/types";
import { useCallback } from "react";

import { PokemonCard } from "@/features/pokemon/card";
import { getTrackingStatus } from "@/features/workspace/tracking/tracking.utils";
import { useWorkspace } from "@/features/workspace/use-workspace";

import { usePokedex } from "../use-pokedex";
import { usePokedexEntries } from "../use-pokedex-entries";
import { usePokedexParams } from "../use-pokedex-params";
import { usePokedexProgressBar } from "../use-pokedex-progress-bar";
import { PokedexEmpty } from "./pokedex-empty";
import { PokedexEntryLog } from "./pokedex-entry-log";
import { PokedexGrid } from "./pokedex-grid";
import { PokedexSkeleton } from "./pokedex-skeleton";
import { PokedexToolbar } from "./pokedex-toolbar";

export function Pokedex() {
	const { activeBrushes, signature, trainerId } = useWorkspace();
	const { dex, filters } = usePokedexParams({ trainerId });

	const pokedex = usePokedex({ dex, filters, signature, trainerId });
	const pokedexEntries = usePokedexEntries({
		data: pokedex.data,
		status: filters?.status,
	});

	const isLoading =
		!pokedex.isLoadingMoreData &&
		(pokedex.isLoading || pokedexEntries.isDeffering);

	const emptyEntries = pokedexEntries.pokemon.length === 0;
	const pokedexEntriesAreEmpty =
		pokedex.isEmpty || (!pokedexEntries.isDeffering && emptyEntries);

	const waitingForEntries =
		pokedex.isLoadingWithEmptyPlaceholderData ||
		(pokedexEntries.isDeffering && emptyEntries);

	const renderCards = !waitingForEntries && !pokedexEntriesAreEmpty;
	const shadowOrPurifiedBrushIsActive = activeBrushes.some(
		(b) => b === "shadow" || b === "purified",
	);

	const getStatusOf = useCallback(
		(pokemon: PokedexEntry) => {
			if (filters?.status === "MISSING") return null;
			return getTrackingStatus(pokemon.trackedStates, activeBrushes);
		},
		[activeBrushes, filters],
	);

	usePokedexProgressBar({
		show: { when: pokedex.isLoading || pokedex.isLoadingMoreData },
	});

	return (
		<section className="container mx-auto bg-slate-50 sm:my-8">
			<PokedexToolbar />
			<PokedexGrid isLoading={isLoading}>
				{waitingForEntries && <PokedexSkeleton />}
				{pokedexEntriesAreEmpty && <PokedexEmpty />}
				{renderCards &&
					pokedexEntries.pokemon.map((pokemon, index) => {
						const pokemonStatus = getStatusOf(pokemon);
						const pokemonIsDisabled =
							!pokemon.isShadowAvailable && shadowOrPurifiedBrushIsActive;

						return (
							<PokemonCard
								CardContext={PokedexEntryLog}
								isDisabled={pokemonIsDisabled}
								isTracked={pokemonStatus?.isTracked}
								key={pokemon.id}
								onTap={() => {}}
								pokemon={pokemon}
								shouldPreload={index <= 16}
								suspense={pokedexEntries.isDeffering}
							/>
						);
					})}
			</PokedexGrid>
			<div ref={pokedex.sentinel} />
		</section>
	);
}
