// ── Constants & Configuration ─────────────────────────────────────────────────

export const VARIANTS_COOKIE = "pokedex.variants";
export const DEFAULT_VARIANTS: VariantValue[] = ["alternate_form"];

export const VARIANT_DEFINITIONS = [
	{ key: "alternateForm", urlValue: "alternate_form" },
	{ key: "costume", urlValue: "costume" },
	{ key: "gender", urlValue: "gender" },
	{ key: "temporaryEvolution", urlValue: "temporary_evolution" },
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

// ── Cookie Helpers ────────────────────────────────────────────────────────────

export function writeVariantsCookie(values: VariantValue[]): void {
	let encoded: string;
	if (values.length === 0) encoded = "none";
	else encoded = encodeURIComponent(JSON.stringify(values));

	// biome-ignore lint/suspicious/noDocumentCookie: Needed for client-side persistence
	document.cookie = `${VARIANTS_COOKIE}=${encoded}; max-age=31536000; path=/; SameSite=Lax`;
}
