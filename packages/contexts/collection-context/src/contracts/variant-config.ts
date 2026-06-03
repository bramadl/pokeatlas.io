export const VARIANT_CONFIG = [
	{
		description: "Include alternate forms e.g. Arceus-Flying, Unown",
		key: "alternateForm",
		label: "Alternate Forms",
		urlValue: "af",
	},
	{
		description: "Include costume variants e.g. Pikachu (Rock Star)",
		key: "costume",
		label: "Costume Variants",
		urlValue: "ct",
	},
	{
		description: "Include female variants e.g. Venusaur ♀",
		key: "gender",
		label: "Female Variants",
		urlValue: "gd",
	},
	{
		description: "Include temporary evolutions e.g. Mega Charizard X",
		key: "temporaryEvolution",
		label: "Temporary Evolution",
		urlValue: "te",
	},
] as const;

export type VariantKey = (typeof VARIANT_CONFIG)[number]["key"];
