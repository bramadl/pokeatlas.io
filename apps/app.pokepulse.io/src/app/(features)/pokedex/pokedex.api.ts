"use server";

import { pulse } from "@pokepulse/core/server";

import type {
	BrowsePokedexInput,
	BrowsePokedexOutput,
	TrackPokemonInput,
	TrackPokemonOutput,
} from "./pokedex.contract";

export async function browsePokedex(
	input: BrowsePokedexInput,
): Promise<BrowsePokedexOutput> {
	const result = await pulse.collection.browsePokedex(input);
	if (result.isError()) throw new Error(String(result.error()));
	return result.value();
}

export async function trackPokemon(
	input: TrackPokemonInput,
): Promise<TrackPokemonOutput> {
	const result = await pulse.collection.trackPokemon(input);
	if (result.isError()) throw new Error(String(result.error()));
	return result.value();
}
