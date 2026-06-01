import type { VariantKey } from "./variant.store";

interface VariantOption {
	description: string;
	key: VariantKey;
	label: string;
}

export const APPEARANCE_CONTROL_OPTIONS: VariantOption[] = [
	{
		description: "Include alternate forms e.g. Arceus-Flying, Unown",
		key: "alternateForm",
		label: "Alternate Forms",
	},
	{
		description: "Include temporary evolutions e.g. Mega Charizard X",
		key: "temporaryEvolution",
		label: "Mega / Primal Forms",
	},
];

export const COSMETIC_CONTROL_OPTIONS: VariantOption[] = [
	{
		description: "Include costume variants e.g. Pikachu (Rock Star)",
		key: "costume",
		label: "Costume Variants",
	},
	{
		description: "Include female variants e.g. Venusaur ♀",
		key: "gender",
		label: "Female Variants",
	},
];
