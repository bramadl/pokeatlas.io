"use server";

import type { BrowsePokedexOutput } from "@pokeatlas/core";
import { atlas } from "@pokeatlas/core";

const TRAINER_ID = "00000000-0000-0000-0000-000000000001";

export async function loadMorePokedex(
	page: number,
	search?: string,
): Promise<BrowsePokedexOutput> {
	const result = await atlas.collection.browsePokedex({
		limit: 60,
		page,
		search,
		trainerId: TRAINER_ID,
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
