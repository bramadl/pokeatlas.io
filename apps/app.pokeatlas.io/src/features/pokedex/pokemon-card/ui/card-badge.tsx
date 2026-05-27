import { cn } from "@/lib/utils";

import { getPokemonTheme } from "../card.utils";
import { usePokemonCard } from "../use-pokemon-card";

export function CardBadge() {
	const { pokemon } = usePokemonCard();

	const extraCount = pokemon.trackedStates.filter((s) => s !== "BASE").length;
	const hasBase = pokemon.trackedStates.includes("BASE");
	const theme = getPokemonTheme(pokemon);

	const pillClass = cn(
		"flex items-center justify-center h-4 px-1 rounded-full border shadow-sm",
		"text-[9px] whitespace-nowrap font-medium",
		"animate-in fade-in-0 slide-in-from-bottom-1 transition-all duration-100",
		theme.badgeBg,
		theme.badgeBorder,
		theme.badgeText,
	);

	return (
		<div className="absolute left-1/2 bottom-0 translate-y-1/2 -translate-x-1/2 z-1 flex items-center gap-0.5 pointer-events-none">
			{hasBase && <span className={pillClass}>Base Tracked</span>}
			{extraCount > 0 && (
				<span className={pillClass}>
					+{extraCount} State{extraCount > 1 ? "s" : ""}
				</span>
			)}
		</div>
	);
}
