import type { PokemonRef, TrainerRef } from "@context/shared";
import { Aggregate, DomainError, validator as v } from "@pokeatlas/toolkit";

import type { TrackedStates } from "./tracked-states";

export interface TrackedPokemonProps {
	/**
	 * @description
	 * Referencing a certain unique pokemon within the domain.
	 */
	pokemonRef: PokemonRef;

	/**
	 * @description
	 * Trainer who marks this pokemon as tracked.
	 */
	trackedBy: TrainerRef;

	/**
	 * @description
	 * List of all tracked state combinations.
	 *
	 * @example
	 * [
	 *   ["Shiny"],
	 *   ["Hundo"],
	 *   ["Shiny", "Hundo"]
	 * ]
	 */
	trackedStates: Array<TrackedStates>;
}

/**
 * @description
 * Describing a pokemon capable of being tracked.
 */
export class TrackedPokemon extends Aggregate<TrackedPokemonProps> {
	private constructor(props: TrackedPokemonProps) {
		super(props);
	}

	public static override isValidProps(
		props: TrackedPokemonProps,
	): DomainError | undefined {
		if (!v.isObject(props)) {
			return new DomainError("TrackedPokemon props must be an object", {
				context: TrackedPokemon.name,
			});
		}

		if (!props.pokemonRef) {
			return new DomainError("Pokemon reference is required", {
				context: TrackedPokemon.name,
				field: "pokemonRef",
			});
		}

		if (!props.trackedBy) {
			return new DomainError("Trainer reference is required", {
				context: TrackedPokemon.name,
				field: "trackedBy",
			});
		}

		if (!v.isArray(props.trackedStates)) {
			return new DomainError("trackedStates must be an array", {
				context: TrackedPokemon.name,
				field: "trackedStates",
			});
		}

		const signatures = new Set<string>();
		for (const combo of props.trackedStates) {
			const sig = combo.signature;
			if (signatures.has(sig)) {
				return new DomainError(`Duplicate tracked states: '${sig}'`, {
					context: TrackedPokemon.name,
					field: "trackedStates",
				});
			}
			signatures.add(sig);
		}
	}

	public updateStates(trackedStates: TrackedStates[]): void {
		this.change("trackedStates", trackedStates);
	}
}
