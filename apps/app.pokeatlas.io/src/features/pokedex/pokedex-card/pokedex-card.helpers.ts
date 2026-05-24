import {
	BRUSH_META,
	BRUSH_ORDER,
	BRUSHES,
	type Brush,
	MUTUAL_EXCLUSIONS,
} from "../brush-tool/brush";
import { FORM_BADGE, FORM_LABEL } from "./pokedex-card.constants";

// ── Form helpers ──────────────────────────────────────────────────────────────

export function getFormBadge(form: string | null): string {
	if (!form) return "bg-slate-100 text-slate-800";
	return FORM_BADGE[form] ?? "bg-slate-100 text-slate-800";
}

export function getFormLabel(form: string | null, dex: number): string {
	if (!form) return `#${String(dex).padStart(3, "0")}`;
	return FORM_LABEL[form] ?? form;
}

// ── Combination generator ─────────────────────────────────────────────────────

const TRACKABLE_BRUSHES = BRUSHES.filter((b) => b !== "eraser") as Exclude<
	Brush,
	"eraser"
>[];

function isValidCombo(combo: Brush[]): boolean {
	for (const [a, b] of MUTUAL_EXCLUSIONS) {
		if (combo.includes(a) && combo.includes(b)) return false;
	}
	return true;
}

/**
 * Generates all valid brush combinations derived from MUTUAL_EXCLUSIONS.
 * Future-proof: adding a new exclusion pair automatically shrinks the list.
 */
function generateAllValidCombos(): Brush[][] {
	const result: Brush[][] = [];
	const n = TRACKABLE_BRUSHES.length;

	for (let mask = 1; mask < 1 << n; mask++) {
		const combo: Brush[] = [];
		for (let i = 0; i < n; i++) {
			if (mask & (1 << i)) {
				const brush = TRACKABLE_BRUSHES[i];
				if (brush) combo.push(brush);
			}
		}
		if (isValidCombo(combo)) result.push(combo);
	}

	return result.sort((a, b) => {
		if (a.length !== b.length) return a.length - b.length;

		const aSorted = [...a].sort((x, y) => BRUSH_ORDER[x] - BRUSH_ORDER[y]);
		const bSorted = [...b].sort((x, y) => BRUSH_ORDER[x] - BRUSH_ORDER[y]);

		for (let i = 0; i < aSorted.length; i++) {
			// biome-ignore lint/style/noNonNullAssertion: non-nullable
			const diff = BRUSH_ORDER[aSorted[i]!] - BRUSH_ORDER[bSorted[i]!];
			if (diff !== 0) return diff;
		}
		return 0;
	});
}

// Pre-computed at module load — no runtime cost per card render
const ALL_VALID_COMBOS = generateAllValidCombos();

// ── Public API ────────────────────────────────────────────────────────────────

export interface TrackingCombo {
	isTracked: boolean;
	label: string;
	signature: string;
}

/**
 * Returns all valid tracking combinations annotated with whether
 * each one is currently tracked by this entry.
 */
export function getAllPossibleCombinations(
	trackedStates: string[],
): TrackingCombo[] {
	return ALL_VALID_COMBOS.map((combo) => {
		const signature = [...combo]
			.sort((a, b) => BRUSH_ORDER[a] - BRUSH_ORDER[b])
			.map((b) => b.toUpperCase())
			.join("+");

		const label = combo.map((b) => BRUSH_META[b].label).join(" ");

		return { isTracked: trackedStates.includes(signature), label, signature };
	});
}
