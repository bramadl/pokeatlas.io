"use server";

import type { BrowsePokedexOutput } from "@pokeatlas/core";
import { atlas } from "@pokeatlas/core";

import type { PokedexFilters } from "@/features/pokedex/filter-tool/filter.types";

const TRAINER_ID = "00000000-0000-0000-0000-000000000001";

export async function loadMorePokedex(
	page: number,
	search?: string,
	filters?: Partial<PokedexFilters>,
): Promise<BrowsePokedexOutput> {
	const result = await atlas.collection.browsePokedex({
		form: filters?.form !== "all" ? filters?.form : undefined,
		limit: 60,
		page,
		search,
		status: filters?.status !== "all" ? filters?.status : undefined,
		trainerId: TRAINER_ID,
		types: filters?.types?.length ? filters.types : undefined,
	});

	if (result.isError()) throw new Error(String(result.error()));
	return result.value();
}

export async function trackPokemon(
	pokemonRef: string,
	trackedStates: string[][],
): Promise<void> {
	const result = await atlas.collection.trackPokemon({
		pokemonRef,
		trackedStates,
		trainerId: TRAINER_ID,
	});
	if (result.isError()) throw new Error(String(result.error()));
}
