import type { VariantKey } from "./variant.store";

export const VARIANT_CONTROL_OPTIONS: {
	key: VariantKey;
	label: string;
	description: string;
}[] = [
	{
		description: "Include alternate forms e.g. Arceus-Flying, Unown",
		key: "alternateForm",
		label: "Alternate Forms",
	},
	{
		description: "Include costume variants e.g. Pikachu (Rock Star)",
		key: "costume",
		label: "Costumes",
	},
	{
		description: "Include female variants e.g. Venusaur ♀",
		key: "gender",
		label: "Female Forms",
	},
	{
		description: "Include temporary evolutions e.g. Mega Charizard X",
		key: "temporaryEvolution",
		label: "Mega / Primal",
	},
];
