import { DomainError, ValueObject, validator as v } from "@pokepulse/toolkit";

import {
	TRACKABLE_STATE,
	type TrackableState,
} from "#collection:contracts/trackable-state";
import { TrackedStateRef } from "#collection:contracts/tracked-state-ref";
import {
	sortSignature,
	TRACKING_SIGNATURE_MUTUAL_EXCLUSIONS,
} from "#collection:contracts/tracking-signature";

export class TrackingSignature extends ValueObject<string> {
	private static readonly DELIMITTER = "+";

	private constructor(value: string) {
		super(value);
	}

	public static override isValidProps(value: string): DomainError | undefined {
		if (!v.isString(value)) {
			return new DomainError("invalid type", {
				context: TrackingSignature.name,
			});
		}

		if (v.string(value).isEmpty()) {
			return new DomainError("signature cannot be empty", {
				context: TrackingSignature.name,
			});
		}

		const states = value.split(
			TrackingSignature.DELIMITTER,
		) as TrackableState[];

		for (const state of states) {
			if (!(state in TRACKABLE_STATE)) {
				return new DomainError(`invalid trackable state: '${state}'`, {
					context: TrackingSignature.name,
				});
			}
		}

		const uniqueStates = new Set(states);
		if (uniqueStates.size !== states.length) {
			return new DomainError(
				"duplicate states are not allowed in a single signature",
				{ context: TrackingSignature.name },
			);
		}

		if (states.includes(TRACKABLE_STATE.BASE) && states.length > 1) {
			return new DomainError(`${TRACKABLE_STATE.BASE} should be standalone`, {
				context: TrackingSignature.name,
			});
		}

		for (const state of states) {
			const exclusions = TRACKING_SIGNATURE_MUTUAL_EXCLUSIONS[state] ?? [];

			for (const excludedState of exclusions) {
				if (excludedState === state) continue;
				if (states.includes(excludedState)) {
					return new DomainError(
						`${state} and ${excludedState} cannot coexist in the same signature`,
						{ context: TrackingSignature.name },
					);
				}
			}
		}
	}

	private get sortedValue(): string {
		return sortSignature(this.get("value"));
	}

	public sorted(): TrackingSignature {
		return new TrackingSignature(this.sortedValue);
	}

	public toRef(): TrackedStateRef {
		return TrackedStateRef.from(this.sortedValue);
	}
}
