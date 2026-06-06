import type { PokemonRef, TrackedStateRef } from "@context/game";
import { BaseDomainEvent } from "@pokepulse/toolkit";

import { TrackedPokemon } from "./tracked-pokemon";
import type { TrainerRef } from "./trainer-ref";

export interface PokemonTrackedPayload {
	pokemonRef: PokemonRef;
	trackedBy: TrainerRef;
	trackedStates: TrackedStateRef[];
}

export class PokemonTracked extends BaseDomainEvent<PokemonTrackedPayload> {
	static readonly type = "collection:pokemon-tracked" as const;

	public constructor(aggregateId: string, payload: PokemonTrackedPayload) {
		super(PokemonTracked.type, aggregateId, TrackedPokemon.name, payload);
	}
}
