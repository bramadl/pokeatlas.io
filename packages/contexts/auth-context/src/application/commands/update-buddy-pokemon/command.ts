import type { PokemonRef } from "@context/game";
import type { DomainError } from "@pokepulse/toolkit";

import type { TrainerNotFoundError } from "#auth:core/trainer-not-found.ts";

export interface UpdateBuddyPokemonInput {
	buddyPokemonRef: string;
	trainerId: string;
}

export interface UpdateBuddyPokemonOutput {
	buddyPokemonRef: PokemonRef;
	trainerId: string;
}

export type UpdateBuddyPokemonErrors = TrainerNotFoundError | DomainError;

export class UpdateBuddyPokemonCommand {
	public constructor(public readonly input: UpdateBuddyPokemonInput) {}
}
