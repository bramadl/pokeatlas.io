import {
	sortSignature,
	TRACKABLE_STATE,
	TRACKING_SIGNATURE_CANONICAL_ORDER,
	TRACKING_SIGNATURE_MUTUAL_EXCLUSIONS,
	type TrackableState,
	type TrackedStateRef,
} from "@pokepulse/core";

const isValidCombination = (states: TrackableState[]): boolean => {
	if (states.includes(TRACKABLE_STATE.BASE) && states.length > 1) return false;

	for (const state of states) {
		const exclusions = TRACKING_SIGNATURE_MUTUAL_EXCLUSIONS[state];
		for (const excluded of exclusions) {
			if (excluded === state) continue;
			if (states.includes(excluded)) return false;
		}
	}

	return true;
};

export const getAllValidSignatures = (): string[] => {
	const allStates = Object.values(TRACKABLE_STATE) as TrackableState[];
	const results: string[] = [];

	for (let mask = 1; mask < 1 << allStates.length; mask++) {
		const combo = allStates.filter((_, i) => mask & (1 << i));
		if (isValidCombination(combo)) {
			results.push(sortSignature(combo.join("+")));
		}
	}

	return results.sort((a, b) => {
		const aStates = a.split("+") as TrackableState[];
		const bStates = b.split("+") as TrackableState[];

		if (aStates.length !== bStates.length)
			return aStates.length - bStates.length;

		for (let i = 0; i < aStates.length; i++) {
			const currentState = aStates[i];
			const nextState = bStates[i];
			if (!currentState || !nextState) continue;

			const diff =
				TRACKING_SIGNATURE_CANONICAL_ORDER[currentState] -
				TRACKING_SIGNATURE_CANONICAL_ORDER[nextState];
			if (diff !== 0) return diff;
		}

		return 0;
	});
};

export const parseSignature = (signature: TrackedStateRef | string) => {
	return signature.replaceAll("+", " ").toLowerCase();
};
