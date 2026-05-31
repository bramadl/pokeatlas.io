"use client";

import { cn } from "@/lib/utils";

import { usePokemonCard } from "../use-pokemon-card";

export function CardBackground() {
	const { isPokemonTracked, theme } = usePokemonCard();

	return (
		<div className="absolute inset-px rounded-lg pointer-events-none overflow-hidden">
			<div
				className={cn(
					"size-full bg-linear-to-b to-white to-75%",
					"origin-top transition-all",
					theme.cardBg,
					isPokemonTracked ? theme.cardBg : "from-slate-200",
				)}
			/>
		</div>
	);
}
