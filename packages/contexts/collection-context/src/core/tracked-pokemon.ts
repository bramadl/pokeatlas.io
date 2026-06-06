import type { PokemonRef } from "@context/game";
import { Aggregate, DomainError, validator as v } from "@pokepulse/toolkit";

import { PokemonTracked } from "./pokemon-tracked";
import type { TrackedStates } from "./tracked-states";
import { TrackingStatesChanged } from "./tracking-states-changed";
import type { TrainerRef } from "./trainer-ref";

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

	public markAsNew(): void {
		if (!this.isNew()) return;
		this.emit(
			new PokemonTracked(this.id.value(), {
				pokemonRef: this.get("pokemonRef"),
				trackedBy: this.get("trackedBy"),
				trackedStates: this.get("trackedStates").toRef(),
			}),
		);
	}

	public updateTrackedStates(newTrackedStates: TrackedStates): void {
		const previous = this.get("trackedStates");
		if (previous.isEqual(newTrackedStates)) return;

		this.change("trackedStates", newTrackedStates);
		this.emit(
			new TrackingStatesChanged(this.id.value(), {
				by: this.get("trackedBy"),
				from: previous.toRef(),
				on: this.get("pokemonRef"),
				to: newTrackedStates.toRef(),
			}),
		);
	}
}
