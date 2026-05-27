import { cn } from "@/lib/utils";

import {
	getPokemonBadge,
	getPokemonTheme,
	isPokemonTracked,
} from "../card.utils";
import { usePokemonCard } from "../use-pokemon-card";

export function CardContent() {
	const { pokemon } = usePokemonCard();
	const theme = getPokemonTheme(pokemon);

	return (
		<div className="relative z-1 size-full pt-10 flex flex-col items-center rounded-lg">
			<div className="px-3 py-4 text-center">
				<span
					className={cn(
						"px-1.5 py-0.5 rounded-full font-mono text-[10px] uppercase",
						"transition-[color,background-color] duration-100",
						isPokemonTracked(pokemon)
							? [theme.badgeBg, theme.badgeText]
							: "bg-slate-100 text-muted-foreground",
					)}
				>
					{getPokemonBadge(pokemon)}
				</span>
				<p
					className={cn(
						"text-xs text-muted-foreground mt-1 line-clamp-1",
						"transition-[color] duration-100",
						isPokemonTracked(pokemon) && theme.badgeText,
					)}
				>
					{pokemon.name}
				</p>
			</div>
		</div>
	);
}
