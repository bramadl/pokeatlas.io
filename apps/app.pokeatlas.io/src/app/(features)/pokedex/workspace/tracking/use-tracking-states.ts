import type { TrackableState } from "@pokeatlas/core";

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
