"use server";

import { atlas } from "@pokeatlas/core";
import type {
	BrowsePokedexInput,
	CountPokedexInput,
	TrackPokemonInput,
	TrackPokemonOutput,
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

export async function trackPokemon(
	input: TrackPokemonInput,
): Promise<TrackPokemonOutput> {
	const result = await atlas.collection.trackPokemon(input);
	if (result.isError()) throw new Error(String(result.error()));
	return result.value();
}
