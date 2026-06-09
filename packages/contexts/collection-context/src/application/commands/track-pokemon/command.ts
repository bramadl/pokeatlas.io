import type { PokemonRef } from "@context/game";
import type { DomainError } from "@pokepulse/toolkit";

import type { PokemonNotFoundError } from "#collection:core/pokemon-not-found";
import type { TrackingSignatureRef } from "#collection:core/tracking-signature-ref";

export type TrackPokemonInput = {
	pokemonRef: string;
	trackedStates: string[];
	trainerId: string;
};

export type TrackPokemonOutput = {
	pokemonRef: PokemonRef;
	trackedStates: TrackingSignatureRef[];
};

export type TrackPokemonErrors = PokemonNotFoundError | DomainError;

export class TrackPokemonCommand {
	public constructor(public readonly input: TrackPokemonInput) {}
}
