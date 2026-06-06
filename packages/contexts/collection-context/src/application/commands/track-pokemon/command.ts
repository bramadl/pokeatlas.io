import type { PokemonRef, TrackedStateRef } from "@context/game";
import type { DomainError } from "@pokepulse/toolkit";

import type { PokemonNotFoundError } from "#collection:core/pokemon-not-found.ts";

export type TrackPokemonInput = {
	pokemonRef: string;
	trackedStates: string[];
	trainerId: string;
};

export type TrackPokemonOutput = {
	pokemonRef: PokemonRef;
	trackedStates: TrackedStateRef[];
};

export type TrackPokemonErrors = PokemonNotFoundError | DomainError;

export class TrackPokemonCommand {
	public constructor(public readonly input: TrackPokemonInput) {}
}
