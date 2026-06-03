import type { PokemonRef, TrainerRef } from "@context/shared";
import { Aggregate, DomainError, validator as v } from "@pokeatlas/toolkit";

import type { TrackedStates } from "./tracked-states";

export interface TrackedPokemonProps {
	pokemonRef: PokemonRef;
	trackedBy: TrainerRef;
	trackedStates: TrackedStates;
}

export class TrackedPokemon extends Aggregate<TrackedPokemonProps> {
	private constructor(props: TrackedPokemonProps) {
		super(props);
	}

	public static override isValidProps(
		props: TrackedPokemonProps,
	): DomainError | undefined {
		if (!v.isObject(props)) {
			return new DomainError("invalid type", { context: TrackedPokemon.name });
		}

		if (!props.pokemonRef) {
			return new DomainError("missing required field", {
				context: TrackedPokemon.name,
				field: "pokemonRef",
			});
		}

		if (!props.trackedBy) {
			return new DomainError("missing required field", {
				context: TrackedPokemon.name,
				field: "trackedBy",
			});
		}

		if (!props.trackedStates) {
			return new DomainError("missing required field", {
				context: TrackedPokemon.name,
				field: "trackedStates",
			});
		}
	}

	public updateTrackedStates(newTrackedStates: TrackedStates): void {
		this.change("trackedStates", newTrackedStates);
	}
}
