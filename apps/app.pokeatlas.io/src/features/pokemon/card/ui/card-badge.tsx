import { cn } from "@/lib/utils";

import { usePokemonCard } from "../use-pokemon-card";

export interface CardBadgeProps {
	badge: { isTracked: boolean; label: string; others: number } | null;
}

export function CardBadge({ badge }: CardBadgeProps) {
	const { hasShinyState, theme } = usePokemonCard();

	const pill = cn(
		"flex items-center justify-center size-4 rounded-full border shadow-sm",
		"text-[8px] whitespace-nowrap font-medium",
		"animate-in fade-in-0 slide-in-from-bottom-1 transition-all duration-100",
		theme.badgeBg,
		theme.badgeBorder,
		theme.badgeText,
	);

	if (!badge) return null;

	return (
		<aside>
			{hasShinyState && (
				<span className="absolute z-1 top-3 left-3 size-4 text-[8px] p-px rounded-full flex items-center justify-center bg-white shadow-sm">
					✨
				</span>
			)}
			<div className="absolute z-1 top-3 right-3 pointer-events-none">
				{badge.others > 0 && <span className={pill}>+{badge.others}</span>}
			</div>
			<div className="absolute z-1 left-1/2 bottom-0 translate-y-1/2 -translate-x-1/2 pointer-events-none">
				{badge.isTracked && (
					<span className={cn(pill, "size-auto h-4 px-1")}>
						{badge.label} Tracked
					</span>
				)}
			</div>
		</aside>
	);
}
