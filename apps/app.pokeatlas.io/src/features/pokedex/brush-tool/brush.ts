// ── Brush Domain ──────────────────────────────────────────────────────────────
//
// All business rules around tracking brushes live here:
//   - which brushes exist and their display metadata
//   - mutual exclusion constraints
//   - how a set of active brushes maps to a tracked-state "signature"
//
// Pure functions only — no React, no side effects, fully unit-testable.

export const BRUSHES = [
	"shiny",
	"hundo",
	"nundo",
	"shadow",
	"purified",
	"lucky",
	"eraser",
] as const;

export type Brush = (typeof BRUSHES)[number];

/**
 * Canonical display order agreed by the community:
 * Shiny > Hundo/Nundo > Shadow > Purified > Lucky
 */
export const BRUSH_ORDER: Record<Brush, number> = {
	eraser: 6,
	hundo: 1,
	lucky: 5,
	nundo: 2,
	purified: 4,
	shadow: 3,
	shiny: 0,
};

/**
 * Hotkey → brush mapping (only active when speed dial is open).
 * Keys are lowercase single characters.
 */
export const BRUSH_HOTKEY: Record<string, Brush> = {
	e: "eraser",
	h: "hundo",
	l: "lucky",
	n: "nundo",
	p: "purified",
	s: "shiny",
	w: "shadow",
};

/** Reverse map: brush → hotkey label for display in the UI. */
export const BRUSH_HOTKEY_LABEL: Record<Brush, string> = {
	eraser: "E",
	hundo: "H",
	lucky: "L",
	nundo: "N",
	purified: "P",
	shadow: "W",
	shiny: "S",
};

export interface BrushMeta {
	emoji: string;
	label: string;
}

export const BRUSH_META: Record<Brush, BrushMeta> = {
	eraser: { emoji: "🗑️", label: "Eraser" },
	hundo: { emoji: "💯", label: "Hundo" },
	lucky: { emoji: "🍀", label: "Lucky" },
	nundo: { emoji: "0️⃣", label: "Nundo" },
	purified: { emoji: "🌀", label: "Purified" },
	shadow: { emoji: "👾", label: "Shadow" },
	shiny: { emoji: "✨", label: "Shiny" },
};

/** Pairs of brushes where activating one removes the other. */
export const MUTUAL_EXCLUSIONS: [Brush, Brush][] = [
	["hundo", "nundo"],
	["shadow", "purified"],
	["shadow", "lucky"],
	["nundo", "lucky"],
	["nundo", "purified"],
];

/**
 * Split a brush combo into its two display parts for the banner.
 * e.g. ["shiny", "hundo"] → { emojis: "✨💯", names: "Shiny Hundo" }
 * e.g. [] → null (base mode, no banner needed)
 */
export function activeBrushParts(
	brushes: Brush[],
): { emojis: string; names: string } | null {
	if (brushes.length === 0) return null;
	const sorted = sortBrushes(brushes);
	return {
		emojis: sorted.map((b) => BRUSH_META[b].emoji).join(""),
		names: sorted.map((b) => BRUSH_META[b].label).join(" "),
	};
}

/**
 * Given the previous brush selection and a new full selection,
 * apply mutual exclusion rules and return the corrected selection.
 *
 * Eraser is fully exclusive: selecting it clears all other brushes,
 * and selecting any other brush while eraser is active clears eraser.
 */
export function applyBrushConstraints(prev: Brush[], next: Brush[]): Brush[] {
	const lastAdded = next.find((v) => !prev.includes(v));
	if (!lastAdded) return next;

	// Eraser is exclusive in both directions
	if (lastAdded === "eraser") return ["eraser"];
	if (prev.includes("eraser")) return next.filter((v) => v !== "eraser");

	let result = next;
	for (const [a, b] of MUTUAL_EXCLUSIONS) {
		if (lastAdded === a) result = result.filter((v) => v !== b);
		if (lastAdded === b) result = result.filter((v) => v !== a);
	}
	return sortBrushes(result);
}

/**
 * Given an existing list of tracked states and the current active brushes,
 * return the new list of tracked states after a tap:
 *   - Eraser → clears everything.
 *   - Signature already present → removes it (toggle off).
 *   - Signature absent → appends it (toggle on).
 */
export function applyBrushTap(
	currentStates: string[],
	activeBrushes: Brush[],
): string[] {
	if (activeBrushes.includes("eraser")) return [];

	const signature = computeSignature(activeBrushes);

	if (currentStates.includes(signature)) {
		return currentStates.filter((s) => s !== signature);
	}
	return [...currentStates, signature];
}

/**
 * Compute the tracked-state signature string for a given set of active brushes.
 *
 * Rules:
 *   - Eraser brush has no signature (caller handles erasure separately).
 *   - Empty brushes → "BASE".
 *   - Otherwise → sorted, uppercased brush names joined by "+".
 *     e.g. ["shiny", "hundo"] → "HUNDO+SHINY"
 */
export function computeSignature(brushes: Brush[]): string {
	const meaningful = brushes.filter((b) => b !== "eraser");
	if (meaningful.length === 0) return "BASE";
	return sortBrushes(meaningful)
		.map((b) => b.toUpperCase())
		.join("+");
}

/** Returns true when the new state list differs from the old one. */
export function isDirty(prev: string[], next: string[]): boolean {
	if (prev.length !== next.length) return true;
	return next.some((s) => !prev.includes(s));
}

/** Sort a brush array into canonical display order. */
export function sortBrushes(brushes: Brush[]): Brush[] {
	return [...brushes].sort((a, b) => BRUSH_ORDER[a] - BRUSH_ORDER[b]);
}
