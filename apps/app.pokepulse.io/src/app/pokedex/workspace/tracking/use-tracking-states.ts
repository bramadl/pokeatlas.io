import type { TrackableState } from "@pokepulse/core";

interface UseTrackingStatesOptions {
	trackingSignature: string | null;
}

export function useTrackingStates({
	trackingSignature,
}: UseTrackingStatesOptions) {
	return trackingSignature
		? (trackingSignature.split("+") as TrackableState[])
		: [];
}
