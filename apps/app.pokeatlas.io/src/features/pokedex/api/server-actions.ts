"use server";

import { atlas } from "@pokeatlas/core";
import type {
	BrowsePokedexInput,
	CountPokedexInput,
} from "@pokeatlas/core/types";

export async function browsePokedex(input: BrowsePokedexInput) {
	const result = await atlas.collection.browsePokedex(input);
	if (result.isError()) throw new Error(String(result.error()));
	return result.value();
}

export async function countPokedex(input: CountPokedexInput) {
	const result = await atlas.collection.countPokedex(input);
	if (result.isError()) throw new Error(String(result.error()));
	return result.value();
}

// ===== TODO =====
// export async function trackPokemon(
// 	pokemonRef: string,
// 	trackedStates: string[][],
// ): Promise<void> {
// 	const result = await atlas.collection.trackPokemon({
// 		pokemonRef,
// 		trackedStates,
// 		trainerId: TRAINER_ID,
// 	});
// 	if (result.isError()) throw new Error(String(result.error()));
// }
