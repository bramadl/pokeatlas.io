import {
	type BrowsePokedexOutput,
	TrackingSignatureRef,
	type TrackingStatus,
} from "@pokepulse/core";
import type { InfiniteData } from "@tanstack/react-query";

const deriveVisibility = (
	trackedStates: TrackingSignatureRef[],
	trackingSignature: string,
	trackingStatus: TrackingStatus,
): boolean => {
	if (trackingStatus === "ALL") return true;
	else if (trackingStatus === "TRACKED") {
		return trackedStates.includes(TrackingSignatureRef.from(trackingSignature));
	} else if (trackingStatus === "MISSING") {
		return !trackedStates.includes(
			TrackingSignatureRef.from(trackingSignature),
		);
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
