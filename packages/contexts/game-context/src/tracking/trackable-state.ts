export const TRACKABLE_STATE = {
	BASE: "BASE",
	HUNDO: "HUNDO",
	LUCKY: "LUCKY",
	NUNDO: "NUNDO",
	PURIFIED: "PURIFIED",
	SHADOW: "SHADOW",
	SHINY: "SHINY",
} as const;

export type TrackableState = keyof typeof TRACKABLE_STATE;

export const TRACKABLE_STATE_BRUSHES: Record<
	TrackableState | "ERASER",
	{ hotkey: string; emoji: string | null }
> = {
	BASE: {
		emoji: null,
		hotkey: "B",
	},
	ERASER: {
		emoji: "🧹",
		hotkey: "DEL",
	},
	HUNDO: {
		emoji: "💯",
		hotkey: "H",
	},
	LUCKY: {
		emoji: "🍀",
		hotkey: "L",
	},
	NUNDO: {
		emoji: "⛔",
		hotkey: "N",
	},
	PURIFIED: {
		emoji: "💫",
		hotkey: "P",
	},
	SHADOW: {
		emoji: "🌑",
		hotkey: "W",
	},
	SHINY: {
		emoji: "✨",
		hotkey: "S",
	},
};

export const TRACKABLE_STATE_LABEL: Record<TrackableState, string> = {
	BASE: "Base",
	HUNDO: "Hundo",
	LUCKY: "Lucky",
	NUNDO: "Nundo",
	PURIFIED: "Purified",
	SHADOW: "Shadow",
	SHINY: "Shiny",
};
