/**
 * @description
 * An intrinsic value describing the state of a tracked pokemon.
 */
export type TrackableState = keyof typeof TRACKABLE_STATES;
export const TRACKABLE_STATES = {
	BASE: "BASE",
	HUNDO: "HUNDO",
	LUCKY: "LUCKY",
	NUNDO: "NUNDO",
	PURIFIED: "PURIFIED",
	SHADOW: "SHADOW",
	SHINY: "SHINY",
} as const;
