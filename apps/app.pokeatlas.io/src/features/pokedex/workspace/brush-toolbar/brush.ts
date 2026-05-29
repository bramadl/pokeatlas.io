// ── Brush Domain ──────────────────────────────────────────────────────────────
//
// Pure functions only — no React, no side effects, fully unit-testable.
// This is the single source of truth for all brush business rules.

import {
	CloverIcon,
	CrownIcon,
	EraserIcon,
	GhostIcon,
	HandPointingIcon,
	type Icon,
	NumberZeroIcon,
	ShootingStarIcon,
	SparkleIcon,
} from "@phosphor-icons/react";
import { TRACKABLE_STATES, type TrackableState } from "@pokeatlas/core/types";
import type { ViewKey } from "../view.options";

// ── Types ─────────────────────────────────────────────────────────────────────

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

// ── Display metadata ──────────────────────────────────────────────────────────

export interface BrushMeta {
	/** Keyboard shortcut shown in tooltip */
	hotkey: string;
	icon: Icon;
	label: string;
	text?: string;
}

export const BRUSH_META: Record<Brush, BrushMeta> = {
	eraser: {
		hotkey: "E",
		icon: EraserIcon,
		label: "Eraser",
		text: "🧹",
	},
	hundo: {
		hotkey: "H",
		icon: CrownIcon,
		label: "Hundo",
		text: "💯",
	},
	lucky: {
		hotkey: "L",
		icon: CloverIcon,
		label: "Lucky",
		text: "🍀",
	},
	nundo: {
		hotkey: "N",
		icon: NumberZeroIcon,
		label: "Nundo",
		text: "❌",
	},
	purified: {
		hotkey: "P",
		icon: ShootingStarIcon,
		label: "Purified",
		text: "💫",
	},
	shadow: {
		hotkey: "W",
		icon: GhostIcon,
		label: "Shadow",
		text: "🌑",
	},
	shiny: {
		hotkey: "S",
		icon: SparkleIcon,
		label: "Shiny",
		text: "🌟",
	},
};

// Pointer (BASE brush) has its own meta because it lives separately in the UI
export const POINTER_META: Omit<BrushMeta, "hotkey"> & { hotkey: null } = {
	hotkey: null,
	icon: HandPointingIcon,
	label: "Base",
};

/**
 * Canonical display order agreed by the community:
 * Shiny > Hundo > Nundo > Shadow > Purified > Lucky > Eraser
 */
export const BRUSH_ORDER: Record<Brush, number> = {
	eraser: 6,
	hundo: 4,
	lucky: 3,
	nundo: 5,
	purified: 2,
	shadow: 1,
	shiny: 0,
};

export const HOTKEY_MAP: Record<string, Brush> = Object.fromEntries(
	(Object.entries(BRUSH_META) as [Brush, (typeof BRUSH_META)[Brush]][]).map(
		([brush, meta]) => [meta.hotkey.toLowerCase(), brush],
	),
);

const PRIMITIVE_STATES = Object.values(TRACKABLE_STATES);
export function getActivePrimitives(displayedStates: string[]) {
	const active = new Set<TrackableState>();
	for (const state of displayedStates) {
		for (const primitive of PRIMITIVE_STATES) {
			if (state.includes(primitive)) active.add(primitive);
		}
	}
	return active;
}

// ── Mutual exclusion rules ────────────────────────────────────────────────────

/** Pairs where activating one removes the other. */
export const MUTUAL_EXCLUSIONS: [Brush, Brush][] = [
	["hundo", "nundo"],
	["shadow", "purified"],
	["shadow", "lucky"],
	["nundo", "lucky"],
	["nundo", "purified"],
];

// ── View-based disable rules ──────────────────────────────────────────────────

/**
 * Given an active view, return the set of brushes that must be disabled.
 *
 * | View      | Disabled brushes      | Reason                                      |
 * |-----------|-----------------------|---------------------------------------------|
 * | SHADOW    | purified, lucky       | Shadow ≠ Purified; Shadow can't be traded   |
 * | PURIFIED  | shadow, nundo         | Already purified; purified IVs ≥ 2/2/2      |
 * | HUNDO     | nundo                 | Hundo ≠ Nundo                               |
 * | NUNDO     | hundo, purified       | Nundo ≠ Hundo; purified becomes 2/2/2       |
 * | LUCKY     | shadow                | Lucky can't be Shadow                       |
 * | BASE      | —                     | All brushes valid                           |
 * | SHINY     | —                     | Shiny can combine with anything             |
 */
export function getDisabledBrushes(activeView: ViewKey): Set<Brush> {
	switch (activeView) {
		case "SHADOW":
			return new Set<Brush>(["purified", "lucky"]);
		case "PURIFIED":
			return new Set<Brush>(["shadow", "nundo"]);
		case "HUNDO":
			return new Set<Brush>(["nundo"]);
		case "NUNDO":
			return new Set<Brush>(["hundo", "purified"]);
		case "LUCKY":
			return new Set<Brush>(["shadow"]);
		default:
			return new Set<Brush>();
	}
}

// ── Constraint application ────────────────────────────────────────────────────

/**
 * Given the previous brush selection and a new full selection (from toggle),
 * apply mutual exclusion rules and return the corrected selection.
 *
 * Eraser is fully exclusive: selecting it clears all others,
 * and selecting anything else while eraser is active clears eraser.
 *
 * Also strips any brushes that are currently disabled by the active view —
 * this guards against stale state when the user switches views while brushes
 * are selected.
 */
export function applyBrushConstraints(
	prev: Brush[],
	next: Brush[],
	disabledBrushes: Set<Brush> = new Set(),
): Brush[] {
	// Strip view-disabled brushes first
	const allowed = next.filter((b) => !disabledBrushes.has(b));

	const lastAdded = allowed.find((v) => !prev.includes(v));
	if (!lastAdded) return allowed;

	if (lastAdded === "eraser") return ["eraser"];
	if (prev.includes("eraser")) return allowed.filter((v) => v !== "eraser");

	let result = allowed;
	for (const [a, b] of MUTUAL_EXCLUSIONS) {
		if (lastAdded === a) result = result.filter((v) => v !== b);
		if (lastAdded === b) result = result.filter((v) => v !== a);
	}
	return sortBrushes(result);
}

// ── Tap logic ─────────────────────────────────────────────────────────────────

/**
 * Given an existing list of tracked states and the current active brushes,
 * return the new list of tracked states after a tap:
 *   - No active brushes (pointer mode) → toggle BASE.
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
 *   - Empty brushes (pointer/BASE mode) → "BASE"
 *   - Eraser has no signature (caller handles erasure separately)
 *   - Otherwise → sorted, uppercased brush names joined by "+"
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
