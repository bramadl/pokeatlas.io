"use client";

import { cn } from "@/lib/utils";

import { usePokemonCard } from "../use-pokemon-card";

export function CardContent() {
	const { hasShinyState, isPokemonTracked, pokemon, pokemonBadge, theme } =
		usePokemonCard();

	return (
		<div className="relative z-1 size-full pt-10 flex flex-col items-center rounded-lg">
			{hasShinyState && (
				<span className="absolute z-1 top-3 left-3 size-4 text-[8px] p-px rounded-full flex items-center justify-center bg-white shadow-sm">
					✨
				</span>
			)}
			<div className="px-3 py-4 text-center">
				<span
					className={cn(
						"px-1.5 py-0.5 rounded-full font-mono text-[10px] uppercase",
						"transition-[background-color,color] duration-100",
						isPokemonTracked
							? [theme.badgeBg, theme.badgeText]
							: "bg-slate-100 text-muted-foreground",
					)}
				>
					{pokemonBadge}
				</span>
				<p
					className={cn(
						"text-xs text-muted-foreground mt-1 line-clamp-1",
						"transition-[color] duration-100",
						isPokemonTracked && theme.badgeText,
					)}
				>
					{pokemon.name}
				</p>
			</div>
		</div>
	);
}
