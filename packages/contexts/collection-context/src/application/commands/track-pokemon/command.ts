import type { PokemonRef } from "@context/shared";
import type { DomainError } from "@pokepulse/toolkit";

import type { PokemonNotFoundError } from "#collection:contracts/pokemon-not-found.error.ts";
import type { TrackedStateRef } from "#collection:contracts/tracked-state-ref";

export interface TrackPokemonInput {
	pokemonRef: string;
	trackedStates: string[];
	trainerId: string;
}

export type TrackPokemonOutput = {
	pokemonRef: PokemonRef;
	trackedStates: TrackedStateRef[];
};

export type TrackPokemonErrors = PokemonNotFoundError | DomainError;

export class TrackPokemonCommand {
	public constructor(public readonly input: TrackPokemonInput) {}
}
