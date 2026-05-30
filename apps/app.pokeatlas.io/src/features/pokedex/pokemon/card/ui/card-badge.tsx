"use client";

import { cn } from "@/lib/utils";

import { usePokemonCard } from "../use-pokemon-card";

interface CardBadgeProps {
	compoundCount: number;
}

export function CardBadge({ compoundCount }: CardBadgeProps) {
	const { theme } = usePokemonCard();

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
			<span className={pillClass}>
				+{compoundCount} More State{compoundCount > 1 ? "s" : ""}
			</span>
		</div>
	);
}
