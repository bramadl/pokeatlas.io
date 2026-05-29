import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import {
	BRUSH_META,
	BRUSH_ORDER,
	type Brush,
	computeSignature,
	MUTUAL_EXCLUSIONS,
} from "../../workspace/brush-toolbar/brush";
import { usePokemonCard } from "../card.context";
import { getPokemonDex, getPokemonTheme } from "../card.utils";

// ── Generate all valid combos ─────────────────────────────────────────────────

const MEANINGFUL_BRUSHES: Brush[] = [
	"shiny",
	"hundo",
	"nundo",
	"shadow",
	"purified",
	"lucky",
];

function isValidCombo(combo: Brush[]): boolean {
	for (const [a, b] of MUTUAL_EXCLUSIONS) {
		if (combo.includes(a) && combo.includes(b)) return false;
	}
	return true;
}

function allSubsets<T>(arr: T[]): T[][] {
	const result: T[][] = [];
	const total = 1 << arr.length;
	for (let mask = 1; mask < total; mask++) {
		result.push(arr.filter((_, i) => mask & (1 << i)));
	}
	return result;
}

function comboLabel(combo: Brush[]): string {
	return [...combo]
		.sort((a, b) => BRUSH_ORDER[a] - BRUSH_ORDER[b])
		.map((b) => BRUSH_META[b].label)
		.join(" ");
}

const ALL_VALID_COMBOS: { signature: string; label: string }[] = allSubsets(
	MEANINGFUL_BRUSHES,
)
	.filter(isValidCombo)
	.sort((a, b) => {
		if (a.length !== b.length) return a.length - b.length;

		for (let i = 0; i < a.length; i++) {
			const diff = BRUSH_ORDER[a[i] as Brush] - BRUSH_ORDER[b[i] as Brush];
			if (diff !== 0) return diff;
		}
		return 0;
	})
	.map((combo) => {
		const sorted = [...combo].sort((a, b) => BRUSH_ORDER[a] - BRUSH_ORDER[b]);
		return { label: comboLabel(sorted), signature: computeSignature(sorted) };
	});

// ── Component ─────────────────────────────────────────────────────────────────

export function CardTrackLog() {
	const { displayedStates, pokemon } = usePokemonCard();

	const theme = getPokemonTheme(pokemon);
	const isTracked = displayedStates.length > 0;

	const trackedSet = new Set(
		displayedStates.map((s) => {
			if (s === "BASE") return "BASE";
			const parts = s.split("+").map((p) => p.toLowerCase()) as Brush[];
			return computeSignature(parts);
		}),
	);

	const trackedCount = ALL_VALID_COMBOS.filter((c) =>
		trackedSet.has(c.signature),
	).length;

	const lastModified = pokemon.lastModifiedAt
		? new Date(pokemon.lastModifiedAt).toLocaleDateString("id-ID", {
				day: "2-digit",
				month: "2-digit",
				year: "numeric",
			})
		: null;

	return (
		<div className="flex flex-col gap-3">
			<header className="flex flex-col gap-1">
				<div className="flex items-center gap-1">
					<span
						className={cn(
							"px-1.5 py-0.5 rounded-full font-mono text-[10px] uppercase",
							"transition-[color,background-color] duration-100",
							isTracked
								? [theme.badgeBg, theme.badgeText]
								: "bg-slate-100 text-muted-foreground",
						)}
					>
						{getPokemonDex(pokemon)}
					</span>
					<span className="text-muted-foreground/10">|</span>
					<span
						className={cn(
							"text-muted-foreground text-xs inline-flex items-center gap-0.5",
							isTracked && theme.badgeText,
						)}
					>
						{isTracked ? "Base species tracked" : "Not tracked yet"}
					</span>
				</div>
				<p className="font-bold text-sm">{pokemon.name}</p>
			</header>

			<Separator />

			<ul
				className="grid grid-cols-2 gap-1"
				style={{
					gridAutoFlow: "column",
					gridTemplateRows: `repeat(${Math.ceil(ALL_VALID_COMBOS.length / 2)}, auto)`,
				}}
			>
				{ALL_VALID_COMBOS.map((combo) => {
					const tracked = trackedSet.has(combo.signature);
					return (
						<li
							className={cn(
								"flex items-center justify-between gap-4 text-xs px-2 py-1 rounded",
								tracked
									? "bg-green-50 text-green-800"
									: "text-muted-foreground",
							)}
							key={combo.signature}
						>
							<span>{combo.label}</span>
							<span
								className={cn(
									"font-mono text-[10px]",
									tracked ? "text-green-600" : "text-muted-foreground/50",
								)}
							>
								{tracked ? "✓" : "–"}
							</span>
						</li>
					);
				})}
			</ul>

			<Separator />

			<div className="flex items-center justify-between gap-1">
				<p className="text-xs text-muted-foreground">
					{trackedCount === 0
						? "No states tracked yet"
						: `${trackedCount} of ${ALL_VALID_COMBOS.length} states tracked`}
				</p>

				{lastModified && (
					<span className="text-xs text-muted-foreground">
						Last modified at {lastModified}
					</span>
				)}
			</div>
		</div>
	);
}
