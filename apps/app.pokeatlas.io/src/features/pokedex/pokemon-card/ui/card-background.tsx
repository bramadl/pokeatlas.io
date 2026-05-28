import { cn } from "@/lib/utils";

import { getPokemonTheme, isPokemonTracked } from "../card.utils";
import { usePokemonCard } from "../use-pokemon-card";

export function CardBackground() {
	const { pokemon } = usePokemonCard();
	const theme = getPokemonTheme(pokemon);

	return (
		<div className="absolute inset-px rounded-lg pointer-events-none overflow-hidden">
			<div
				className={cn(
					"size-full bg-linear-to-b to-white to-75%",
					"origin-top transition-[opacity,scale] duration-300 ease-in-out",
					isPokemonTracked(pokemon)
						? ["opacity-100 scale-100", theme.cardBg]
						: "opacity-0 scale-y-0 group-hover:opacity-100 group-hover:scale-100 from-slate-300",
				)}
			/>
		</div>
	);
}
