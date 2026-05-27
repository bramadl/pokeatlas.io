import { POKEDEX_STATUSES } from "@pokeatlas/core/types";

export const STATUS_OPTIONS = POKEDEX_STATUSES.map((s) => ({
	label: s.charAt(0) + s.slice(1).toLowerCase(), // "Missing", "Tracked"
	value: s.toLowerCase(),
}));
