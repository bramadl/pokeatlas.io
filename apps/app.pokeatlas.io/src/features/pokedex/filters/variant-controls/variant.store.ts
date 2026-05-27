// ── Single source of truth ────────────────────────────────────────────────────

export const VARIANT_DEFINITIONS = [
	{
		key: "alternateForm",
		storageKey: "pokedex.filter.variant.alternateForm",
		urlValue: "alternate_form",
	},
	{
		key: "costume",
		storageKey: "pokedex.filter.variant.costume",
		urlValue: "costume",
	},
	{
		key: "gender",
		storageKey: "pokedex.filter.variant.gender",
		urlValue: "gender",
	},
	{
		key: "temporaryEvolution",
		storageKey: "pokedex.filter.variant.temporaryEvolution",
		urlValue: "temporary_evolution",
	},
] as const;

// ── Derived types & lookups ───────────────────────────────────────────────────

export type VariantKey = (typeof VARIANT_DEFINITIONS)[number]["key"];
export type VariantValue = (typeof VARIANT_DEFINITIONS)[number]["urlValue"];

export const VARIANT_VALUES = VARIANT_DEFINITIONS.map((v) => v.urlValue);

export const VARIANTS_BY_KEY = Object.fromEntries(
	VARIANT_DEFINITIONS.map((v) => [v.key, v]),
) as Record<VariantKey, (typeof VARIANT_DEFINITIONS)[number]>;

export const VARIANTS_BY_URL_VALUE = Object.fromEntries(
	VARIANT_DEFINITIONS.map((v) => [v.urlValue, v]),
) as Record<VariantValue, (typeof VARIANT_DEFINITIONS)[number]>;

// ── localStorage persistence helpers ─────────────────────────────────────────

export function readStored(key: VariantKey): boolean {
	try {
		return localStorage.getItem(VARIANTS_BY_KEY[key].storageKey) === "true";
	} catch {
		return false;
	}
}

export function writeStored(key: VariantKey, value: boolean): void {
	try {
		localStorage.setItem(VARIANTS_BY_KEY[key].storageKey, String(value));
	} catch {}
}

export function getInitialVariants(): VariantValue[] {
	return VARIANT_DEFINITIONS.filter((v) => readStored(v.key)).map(
		(v) => v.urlValue,
	);
}
