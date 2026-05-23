import type { PokemonNotFoundError } from "@context/shared";
import type { DomainError } from "@pokeatlas/toolkit";

export interface TrackPokemonInput {
	pokemonRef: string;
	trackedStates: Array<string[]>;
	trainerId: string;
}

export type TrackPokemonOutput = undefined;

export type TrackPokemonErrors = PokemonNotFoundError | DomainError;

export class TrackPokemonCommand {
	public constructor(public readonly input: TrackPokemonInput) {}
}
