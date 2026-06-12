import type { AchievementType } from "@pokepulse/core";

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
