import { TRACKABLE_STATE, type TrackableState } from "./trackable-state";

export const TRACKING_SIGNATURE_CANONICAL_ORDER: Record<
	TrackableState,
	number
> = {
	BASE: 0,
	HUNDO: 5,
	LUCKY: 4,
	NUNDO: 6,
	PURIFIED: 3,
	SHADOW: 2,
	SHINY: 1,
} as const;

export const TRACKING_SIGNATURE_MUTUAL_EXCLUSIONS: Record<
	TrackableState,
	TrackableState[]
> = {
	BASE: [
		TRACKABLE_STATE.BASE,
		TRACKABLE_STATE.SHINY,
		TRACKABLE_STATE.SHADOW,
		TRACKABLE_STATE.PURIFIED,
		TRACKABLE_STATE.LUCKY,
		TRACKABLE_STATE.HUNDO,
		TRACKABLE_STATE.NUNDO,
	],
	HUNDO: [TRACKABLE_STATE.BASE, TRACKABLE_STATE.HUNDO, TRACKABLE_STATE.NUNDO],
	LUCKY: [
		TRACKABLE_STATE.BASE,
		TRACKABLE_STATE.LUCKY,
		TRACKABLE_STATE.NUNDO,
		TRACKABLE_STATE.SHADOW,
	],
	NUNDO: [
		TRACKABLE_STATE.BASE,
		TRACKABLE_STATE.HUNDO,
		TRACKABLE_STATE.LUCKY,
		TRACKABLE_STATE.PURIFIED,
		TRACKABLE_STATE.NUNDO,
	],
	PURIFIED: [
		TRACKABLE_STATE.BASE,
		TRACKABLE_STATE.NUNDO,
		TRACKABLE_STATE.SHADOW,
		TRACKABLE_STATE.PURIFIED,
	],
	SHADOW: [
		TRACKABLE_STATE.BASE,
		TRACKABLE_STATE.LUCKY,
		TRACKABLE_STATE.PURIFIED,
		TRACKABLE_STATE.SHADOW,
	],
	SHINY: [TRACKABLE_STATE.BASE, TRACKABLE_STATE.SHINY],
} as const;

export const computeSignature = (
	currentStates: TrackableState[],
	nextState: TrackableState,
	delimitter: string = "+",
): string => {
	if (currentStates.includes(nextState)) {
		const nextSignature = currentStates.filter((s) => s !== nextState);
		return nextSignature.length
			? sortSignature(nextSignature.join(delimitter))
			: TRACKABLE_STATE.BASE;
	}

	if (nextState === TRACKABLE_STATE.BASE) {
		return TRACKABLE_STATE.BASE;
	}

	const withoutBase = currentStates.filter((s) => s !== TRACKABLE_STATE.BASE);

	const exclusions = new Set(TRACKING_SIGNATURE_MUTUAL_EXCLUSIONS[nextState]);
	const survivors = withoutBase.filter((s) => !exclusions.has(s));

	const nextSignature = [...survivors, nextState];
	return sortSignature(nextSignature.join(delimitter));
};

export const sortSignature = (signature: string, delimitter: string = "+") => {
	const states = signature.split(delimitter) as TrackableState[];
	return [...states]
		.sort(
			(a, b) =>
				TRACKING_SIGNATURE_CANONICAL_ORDER[a] -
				TRACKING_SIGNATURE_CANONICAL_ORDER[b],
		)
		.join(delimitter);
};
