"use server";

import { pulse, type TeamOption } from "@pokepulse/core/server";
import { auth } from "@/lib/auth/server";

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
