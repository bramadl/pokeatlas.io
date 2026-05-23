/**
 * @description
 * List of all Trackable State value.
 */
export const TRACKABLE_STATES = {
	BASE: "BASE",
	HUNDO: "HUNDO",
	LUCKY: "LUCKY",
	NUNDO: "NUNDO",
	PURIFIED: "PURIFIED",
	SHADOW: "SHADOW",
	SHINY: "SHINY",
} as const;

/**
 * @description
 * An intrinsic value describing the state of a tracked pokemon.
 *
 * @example
 * - `Shiny`
 * - `Hundo`
 * - `Nundo`
 * - `Lucky`
 */
export type TrackableState = keyof typeof TRACKABLE_STATES;
