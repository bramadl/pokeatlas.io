import { cn } from "@/lib/utils";

import type { PokemonCardTheme } from "./pokemon-card.theme";

interface PokemonCardContentProps {
	pokemonBadge: string;
	pokemonName: string;
	theme: PokemonCardTheme;
}

export function PokemonCardContent({
	pokemonBadge,
	pokemonName,
	theme,
}: PokemonCardContentProps) {
	return (
		<div className="relative z-1 size-full pt-10 flex flex-col items-center rounded-lg">
			<div className="px-3 py-4 text-center">
				<span
					className={cn(
						"px-1.5 py-0.5 rounded-full font-mono text-[10px] uppercase",
						[theme.badgeBg, theme.badgeText],
					)}
				>
					{pokemonBadge}
				</span>
				<p
					className={cn(
						"text-xs text-muted-foreground mt-1 line-clamp-1",
						theme.badgeText,
					)}
				>
					{pokemonName}
				</p>
			</div>
		</div>
	);
}
