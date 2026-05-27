import { DomainError, ValueObject, validator as v } from "@pokeatlas/toolkit";

import {
	TRACKABLE_STATES,
	type TrackableState,
} from "../definitions/trackable-state";

export interface TrackedStatesProps {
	states: TrackableState[];
}

/**
 * @description
 * A single combination of TrackableStates compound together.
 * Represents one "achievement" a trainer has for a pokemon.
 *
 * @example
 * - TrackedStates.create(["Shiny"])
 * - TrackedStates.create(["Hundo"])
 * - TrackedStates.create(["Shiny", "Hundo"])
 */
export class TrackedStates extends ValueObject<TrackedStatesProps> {
	private constructor(props: TrackedStatesProps) {
		super(props);
	}

	public static override isValidProps(
		props: TrackedStatesProps,
	): DomainError | undefined {
		if (!v.isArray(props.states)) {
			return new DomainError("States must be an array", {
				context: TrackedStates.name,
				field: "states",
			});
		}

		if (props.states.length === 0) {
			return new DomainError("States cannot be empty", {
				context: TrackedStates.name,
				field: "states",
			});
		}

		for (const state of props.states) {
			if (!(state in TRACKABLE_STATES)) {
				return new DomainError(`Invalid trackable state: '${state}'`, {
					context: TrackedStates.name,
					field: "states",
				});
			}
		}

		if (
			props.states.includes(TRACKABLE_STATES.HUNDO) &&
			props.states.includes(TRACKABLE_STATES.NUNDO)
		) {
			return new DomainError("Hundo and Nundo cannot coexist", {
				context: TrackedStates.name,
				field: "states",
			});
		}

		if (
			props.states.includes(TRACKABLE_STATES.SHADOW) &&
			props.states.includes(TRACKABLE_STATES.PURIFIED)
		) {
			return new DomainError("Shadow and Purified cannot coexist", {
				context: TrackedStates.name,
				field: "states",
			});
		}

		if (
			props.states.includes(TRACKABLE_STATES.BASE) &&
			props.states.length > 1
		) {
			return new DomainError("Base cannot be combined with other states", {
				context: TrackedStates.name,
				field: "states",
			});
		}
	}

	/**
	 * @description
	 * Normalized signature for equality/dedup checks.
	 * e.g. ["Shiny", "Hundo"] and ["Hundo", "Shiny"] → "Hundo+Shiny"
	 */
	public get signature(): string {
		return [...this.props.states].sort((a, b) => a.localeCompare(b)).join("+");
	}

	// ── Persistence ─────────────────────────────────────────────────────────

	/**
	 * @description
	 * Encode to a single DB string: ["Shiny", "Hundo"] → "Hundo+Shiny".
	 */
	public encode(): string {
		return this.signature;
	}

	/**
	 * @description
	 * Decode from a DB string: "Hundo+Shiny" → TrackedStates.
	 */
	public static decode(raw: string) {
		const states = raw.split("+") as TrackableState[];
		return TrackedStates.create({ states });
	}

	/**
	 * @description
	 * Convenient helper which returns same result from
	 * `TrackedStates.get("states")`.
	 */
	public get value(): TrackableState[] {
		return [...this.props.states];
	}
}
