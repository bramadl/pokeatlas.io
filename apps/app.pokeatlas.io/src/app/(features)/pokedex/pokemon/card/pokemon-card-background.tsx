import { cn } from "@/lib/utils";

import type { PokemonCardTheme } from "./pokemon-card.theme";

interface PokemonCardBackgroundProps {
	theme: PokemonCardTheme;
	tracked?: boolean;
}

export function PokemonCardBackground({
	theme,
	tracked,
}: PokemonCardBackgroundProps) {
	return (
		<div className="absolute inset-px rounded-lg pointer-events-none overflow-hidden">
			<div
				className={cn(
					"size-full bg-linear-to-b to-background to-75%",
					"origin-top transition-all",
					theme.cardBg,
					tracked ? theme.cardBg : "from-slate-200",
				)}
			/>
		</div>
	);
}
