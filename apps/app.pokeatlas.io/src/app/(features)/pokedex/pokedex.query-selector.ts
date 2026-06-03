import {
	type BrowsePokedexOutput,
	TrackedStateRef,
	type TrackingStatus,
} from "@pokeatlas/core";
import type { InfiniteData } from "@tanstack/react-query";

const deriveVisibility = (
	trackedStates: TrackedStateRef[],
	trackingSignature: string,
	trackingStatus: TrackingStatus,
): boolean => {
	if (trackingStatus === "ALL") return true;
	else if (trackingStatus === "TRACKED") {
		return trackedStates.includes(TrackedStateRef.from(trackingSignature));
	} else if (trackingStatus === "MISSING") {
		return !trackedStates.includes(TrackedStateRef.from(trackingSignature));
	}
	return true;
};

export const pokedexQuerySelector = (
	data: InfiniteData<BrowsePokedexOutput, string | null>,
	trackingSignature: string,
	trackingStatus: TrackingStatus,
) => {
	return {
		...data,
		pages: data.pages.map((page) => ({
			...page,
			entries: page.entries.map((entry) => ({
				...entry,
				show: deriveVisibility(
					entry.trackedStates,
					trackingSignature,
					trackingStatus,
				),
			})),
		})),
	};
};
