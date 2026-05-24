import { cn } from "@/lib/utils";

import type { TypeTheme } from "../pokedex-theme";

// ── Helpers ───────────────────────────────────────────────────────────────────

const pillClass = (theme: TypeTheme) =>
	cn(
		"flex items-center justify-center h-4 px-1 rounded-full border shadow-sm",
		"text-[9px] whitespace-nowrap font-medium",
		"animate-in fade-in-0 slide-in-from-bottom-1 transition-all duration-100",
		theme.badgeBg,
		theme.badgeBorder,
		theme.badgeText,
	);

// ── Component ─────────────────────────────────────────────────────────────────

interface PokedexCardBadgeProps {
	theme: TypeTheme;
	trackedStates: string[];
	types: string[];
}

export function PokedexCardBadge({
	theme,
	trackedStates,
}: PokedexCardBadgeProps) {
	const hasBase = trackedStates.includes("BASE");
	const extraCount = trackedStates.filter((s) => s !== "BASE").length;

	if (!hasBase && extraCount === 0) return null;
	return (
		<div className="absolute left-1/2 bottom-0 translate-y-1/2 -translate-x-1/2 z-1 flex items-center gap-0.5 pointer-events-none">
			{hasBase && <span className={pillClass(theme)}>Caught</span>}
			{extraCount > 0 && (
				<span className={pillClass(theme)}>+{extraCount} states</span>
			)}
		</div>
	);
}
