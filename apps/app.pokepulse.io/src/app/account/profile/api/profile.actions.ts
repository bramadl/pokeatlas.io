"use server";

import { pulse, type TeamOption } from "@pokepulse/core/server";
import { auth } from "@/lib/auth/server";
import { browsePokedex } from "@/app/pokedex/api/pokedex.api";

export async function updateProfile(name: string) {
	return auth.updateUser({ name });
}

export async function updateTeam(trainerId: string, team?: TeamOption) {
	const result = await pulse.auth.updateTeam({ team, trainerId });
	if (result.isError()) throw new Error(result.error().message);
	return result.value();
}

export async function updateBuddyPokemon(
	trainerId: string,
	pokemonRef: string,
) {
	const result = await pulse.auth.updateBuddyPokemon({
		buddyPokemonRef: pokemonRef,
		trainerId,
	});
	if (result.isError()) throw new Error(result.error().message);
	return result.value();
}

export interface TrackedPokemonEntry {
	name: string;
	ref: string;
	spriteUrl: string;
}

export async function getTrackedPokemon(
	trainerId: string,
): Promise<TrackedPokemonEntry[]> {
	const result = await browsePokedex({
		filters: { status: "TRACKED" },
		pagination: { cursor: null, limit: 2000 },
		trainerId,
	});

	return result.entries.map((entry) => ({
		name: entry.species.name,
		ref: entry.species.id,
		spriteUrl: entry.species.sprites.url,
	}));
}