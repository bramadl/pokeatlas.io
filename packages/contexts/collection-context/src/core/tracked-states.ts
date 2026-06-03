import { DomainError, ValueObject, validator as v } from "@pokepulse/toolkit";

import type { TrackedStateRef } from "#contracts/tracked-state-ref";

import type { TrackingSignature } from "./tracking-signature";

interface TrackedStatesProps {
	signatures: TrackingSignature[];
}

export class TrackedStates extends ValueObject<TrackedStatesProps> {
	private constructor(props: TrackedStatesProps) {
		super(props);
	}

	public static override isValidProps(
		props: TrackedStatesProps,
	): DomainError | undefined {
		if (!v.isObject(props)) {
			return new DomainError("invalid props type", {
				context: TrackedStates.name,
			});
		}

		if (!v.isArray(props.signatures)) {
			return new DomainError("tracked states signatures must be an array", {
				context: TrackedStates.name,
			});
		}

		const rawSignatures = props.signatures.map((sig) => sig.toRef());
		const uniqueSignatures = new Set(rawSignatures);

		if (uniqueSignatures.size !== rawSignatures.length) {
			return new DomainError(
				"duplicate tracked state signatures are not allowed",
				{ context: TrackedStates.name },
			);
		}
	}

	public toRef(): TrackedStateRef[] {
		return this.get("signatures").map((sig) => sig.toRef());
	}
}
