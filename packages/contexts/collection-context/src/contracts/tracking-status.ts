export const TRACKING_STATUSES = ["ALL", "MISSING", "TRACKED"] as const;

export type TrackingStatus = (typeof TRACKING_STATUSES)[number];

export const TRACKING_STATUS_ALIASES: Record<TrackingStatus, string> = {
	ALL: "al",
	MISSING: "ms",
	TRACKED: "tr",
} as const;
