import type { AchievementType } from "@pokepulse/core";

export const ACHIEVEMENT_COLOR_MAP: Record<
	string,
	{ badge: string; card: string; text: string; sub: string }
> = {
	amber: {
		badge: "border-amber-500 ring-amber-500/25 bg-amber-100",
		card: "border-amber-300 bg-amber-50 text-amber-500",
		sub: "text-amber-400",
		text: "text-amber-500",
	},
	green: {
		badge: "border-green-500 ring-green-500/25 bg-green-100",
		card: "border-green-300 bg-green-50 text-green-500",
		sub: "text-green-400",
		text: "text-green-500",
	},
	indigo: {
		badge: "border-indigo-500 ring-indigo-500/25 bg-indigo-100",
		card: "border-indigo-300 bg-indigo-50 text-indigo-500",
		sub: "text-indigo-400",
		text: "text-indigo-500",
	},
	pink: {
		badge: "border-pink-500 ring-pink-500/25 bg-pink-100",
		card: "border-pink-300 bg-pink-50 text-pink-500",
		sub: "text-pink-400",
		text: "text-pink-500",
	},
	purple: {
		badge: "border-purple-500 ring-purple-500/25 bg-purple-100",
		card: "border-purple-300 bg-purple-50 text-purple-500",
		sub: "text-purple-400",
		text: "text-purple-500",
	},
	sky: {
		badge: "border-sky-500 ring-sky-500/25 bg-sky-100",
		card: "border-sky-300 bg-sky-50 text-sky-500",
		sub: "text-sky-400",
		text: "text-sky-500",
	},
	teal: {
		badge: "border-teal-500 ring-teal-500/25 bg-teal-100",
		card: "border-teal-300 bg-teal-50 text-teal-500",
		sub: "text-teal-400",
		text: "text-teal-500",
	},
	yellow: {
		badge: "border-yellow-500 ring-yellow-500/25 bg-yellow-100",
		card: "border-yellow-300 bg-yellow-50 text-yellow-500",
		sub: "text-yellow-400",
		text: "text-yellow-500",
	},
};

interface AchievementMeta {
	color:
		| "sky"
		| "green"
		| "purple"
		| "amber"
		| "yellow"
		| "pink"
		| "indigo"
		| "teal";
	icon: string;
	label: string;
}

export const ACHIEVEMENT_META: Record<AchievementType, AchievementMeta> = {
	FIRST_HUNDO: { color: "yellow", icon: "💯", label: "First Hundo" },
	FIRST_LUCKY: { color: "amber", icon: "🍀", label: "First Lucky" },
	FIRST_NUNDO: { color: "pink", icon: "⛔", label: "First Nundo" },
	FIRST_PURIFIED: { color: "indigo", icon: "💫", label: "First Purified" },
	FIRST_SHADOW: { color: "purple", icon: "🌑", label: "First Shadow" },
	FIRST_SHINY: { color: "sky", icon: "✨", label: "First Shiny" },
	FIRST_TRACKED: { color: "teal", icon: "🎯", label: "First Pokémon Tracked" },
	REGIONAL_ALOLA: { color: "green", icon: "🌺", label: "Alola Dex Complete" },
	REGIONAL_GALAR: { color: "green", icon: "⚔️", label: "Galar Dex Complete" },
	REGIONAL_HISUI: { color: "green", icon: "🏔️", label: "Hisui Dex Complete" },
	REGIONAL_HOENN: { color: "green", icon: "🌊", label: "Hoenn Dex Complete" },
	REGIONAL_JOHTO: { color: "green", icon: "🌸", label: "Johto Dex Complete" },
	REGIONAL_KALOS: { color: "green", icon: "🗼", label: "Kalos Dex Complete" },
	REGIONAL_KANTO: { color: "green", icon: "🌎", label: "Kanto Dex Complete" },
	REGIONAL_PALDEA: { color: "green", icon: "🫒", label: "Paldea Dex Complete" },
	REGIONAL_SINNOH: { color: "green", icon: "🏙️", label: "Sinnoh Dex Complete" },
	REGIONAL_UNOVA: { color: "green", icon: "�️", label: "Unova Dex Complete" },
	TRACKED_10: { color: "teal", icon: "🏅", label: "10 Pokémon Tracked" },
	TRACKED_100: { color: "teal", icon: "🥈", label: "100 Pokémon Tracked" },
	TRACKED_500: { color: "teal", icon: "🥇", label: "500 Pokémon Tracked" },
	TRACKED_1000: { color: "teal", icon: "🏆", label: "1,000 Pokémon Tracked" },
	TRACKING_HUNDO: { color: "yellow", icon: "💯", label: "Hundo Dex Complete" },
	TRACKING_LUCKY: { color: "amber", icon: "🍀", label: "Lucky Dex Complete" },
	TRACKING_NUNDO: { color: "pink", icon: "⛔", label: "Nundo Dex Complete" },
	TRACKING_PURIFIED: {
		color: "indigo",
		icon: "💫",
		label: "Purified Dex Complete",
	},
	TRACKING_SHADOW: {
		color: "purple",
		icon: "🌑",
		label: "Shadow Dex Complete",
	},
	TRACKING_SHINY: { color: "sky", icon: "✨", label: "Shiny Dex Complete" },
	VARIANT_ALTERNATE_FORM: {
		color: "indigo",
		icon: "🔀",
		label: "Alternate Forms Complete",
	},
	VARIANT_COSTUME: {
		color: "indigo",
		icon: "🎭",
		label: "Costume Collection Complete",
	},
	VARIANT_GENDER: {
		color: "pink",
		icon: "♀️",
		label: "Female Variants Complete",
	},
	VARIANT_TEMP_EVOLUTION: {
		color: "indigo",
		icon: "⚡",
		label: "Temp. Evolutions Complete",
	},
};
