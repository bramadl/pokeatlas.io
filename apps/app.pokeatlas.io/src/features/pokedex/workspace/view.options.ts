/**
 * @description
 * A View defines the primary tracking lens the trainer is operating in.
 * Each View corresponds to a TrackableState dimension.
 *
 * BASE = "all pokemon" (no state filter applied).
 * Other views filter the grid to pokemon that have been tracked in that state.
 */
export const POKEDEX_VIEWS = {
	BASE: {
		label: "Base",
		value: "BASE",
	},
	HUNDO: {
		label: "Hundo",
		value: "HUNDO",
	},
	LUCKY: {
		label: "Lucky",
		value: "LUCKY",
	},
	NUNDO: {
		label: "Nundo",
		value: "NUNDO",
	},
	PURIFIED: {
		label: "Purified",
		value: "PURIFIED",
	},
	SHADOW: {
		label: "Shadow",
		value: "SHADOW",
	},
	SHINY: {
		label: "Shiny",
		value: "SHINY",
	},
} as const;
