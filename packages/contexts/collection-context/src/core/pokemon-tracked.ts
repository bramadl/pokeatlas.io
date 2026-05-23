import { BaseDomainEvent } from "@pokeatlas/toolkit";

import type { TrackedPokemon } from "./tracked-pokemon";

export class PokemonTracked extends BaseDomainEvent<TrackedPokemon> {
	static readonly type = "collection:new-pokemon-tracked" as const;

	constructor(aggregateId: string, payload: TrackedPokemon) {
		super(PokemonTracked.type, aggregateId, "Collection", payload);
	}
}
