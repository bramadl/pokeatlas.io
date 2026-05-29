import { cn } from "@/lib/utils";

import { getPokemonTheme } from "../card.utils";
import { usePokemonCard } from "../use-pokemon-card";

export function CardBadge() {
	const { displayedStates, pokemon } = usePokemonCard();

	const compoundCount = displayedStates.filter((s) => s.includes("+")).length;
	const theme = getPokemonTheme(pokemon);

	const pillClass = cn(
		"flex items-center justify-center h-4 px-1 rounded-full border shadow-sm",
		"text-[9px] whitespace-nowrap font-medium",
		"animate-in fade-in-0 slide-in-from-bottom-1 transition-all duration-100",
		theme.badgeBg,
		theme.badgeBorder,
		theme.badgeText,
	);

	if (compoundCount === 0) return;
	return (
		<div className="absolute left-1/2 bottom-0 translate-y-1/2 -translate-x-1/2 z-1 flex items-center gap-0.5 pointer-events-none">
			<span className={pillClass}>
				+{compoundCount} More State{compoundCount > 1 ? "s" : ""}
			</span>
		</div>
	);
}
