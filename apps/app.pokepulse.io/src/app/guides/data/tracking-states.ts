export const TRACKING_STATES = [
	{
		desc: "Standard catch. The Pokémon exists in your collection in its default form.",
		emoji: "👆",
		hotkey: "B / ESC",
		name: "Base",
	},
	{
		desc: "Alternate color variant. Rare and highly sought after by collectors.",
		emoji: "✨",
		hotkey: "S",
		name: "Shiny",
	},
	{
		desc: "Rescued from Team Rocket. Retains its shadow aura.",
		emoji: "🌑",
		hotkey: "W",
		name: "Shadow",
	},
	{
		desc: "A Shadow that's been cleansed. Tracked separately from both Shadow and Base.",
		emoji: "💫",
		hotkey: "P",
		name: "Purified",
	},
	{
		desc: "Obtained via trade with a Lucky Friend. Comes with guaranteed high IVs.",
		emoji: "🍀",
		hotkey: "L",
		name: "Lucky",
	},
	{
		desc: "100% IVs — perfect in every stat. The pinnacle of a standard catch.",
		emoji: "💯",
		hotkey: "H",
		name: "Hundo",
	},
	{
		desc: "0% IVs — the opposite extreme. Equally rare, prized by dedicated collectors.",
		emoji: "⛔",
		hotkey: "N",
		name: "Nundo",
	},
] as const;
