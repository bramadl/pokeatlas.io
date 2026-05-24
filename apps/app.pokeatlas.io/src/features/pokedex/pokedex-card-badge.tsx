import { cn } from "@/lib/utils";

import type { TypeTheme } from "./pokedex-theme";

// ── State emojis ──────────────────────────────────────────────────────────────

const STATE_EMOJI: Record<string, string> = {
	BASE: "✓",
	HUNDO: "💯",
	LUCKY: "🍀",
	NUNDO: "0",
	PURIFIED: "🌀",
	SHADOW: "👾",
	SHINY: "✨",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function renderStateEmoji(state: string): string {
	return state
		.split("+")
		.map((s) => STATE_EMOJI[s] ?? s)
		.join("");
}

// ── Component ─────────────────────────────────────────────────────────────────

interface PokedexCardBadgeProps {
	overflowCount: number;
	theme: TypeTheme;
	visibleStates: string[];
}

export function PokedexCardBadge({
	overflowCount,
	theme,
	visibleStates,
}: PokedexCardBadgeProps) {
	return (
		<div className="absolute left-1/2 bottom-0 translate-y-1/2 md:left-0 md:inset-y-1 -translate-x-1/2 flex md:flex-col items-center justify-center gap-0.5">
			{visibleStates.map((state) => (
				<span
					className={cn(
						"flex items-center justify-center rounded-full border shadow-sm",
						"text-[9px] whitespace-nowrap",
						"animate-in fade-in-0 slide-in-from-left-[2px] duration-300",
						theme.badgeBg,
						theme.badgeBorder,
						theme.badgeText,
						renderStateEmoji(state).length > 1 ? "px-1" : "aspect-square",
					)}
					key={state}
				>
					{renderStateEmoji(state)}
				</span>
			))}
			{overflowCount > 0 && (
				<span
					className={cn(
						"size-4 inline-flex items-center justify-center rounded-full text-[9px] font-semibold border shadow-sm",
						theme.badgeBg,
						theme.badgeBorder,
						theme.badgeText,
					)}
				>
					+{overflowCount}
				</span>
			)}
		</div>
	);
}
