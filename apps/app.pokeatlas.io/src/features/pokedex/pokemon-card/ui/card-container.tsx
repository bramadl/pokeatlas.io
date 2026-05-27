import { cn } from "@/lib/utils";

import { isPokemonTracked } from "../card.utils";
import { usePokemonCard } from "../use-pokemon-card";

export function CardContainer({
	children,
	...props
}: {
	children: React.ReactNode;
}) {
	const { isTrackLogShown, pokemon } = usePokemonCard();
	return (
		<div
			className={cn(
				"relative group mt-10 bg-background drop-shadow-xl drop-shadow-black/5 rounded-lg",
				"transition-[scale] duration-300 will-change-[scale]",
				"scale-100 hover:scale-105",
				isTrackLogShown && "scale-105",
				isPokemonTracked(pokemon) ? "opacity-100" : "opacity-75 grayscale",
			)}
			{...props}
		>
			{children}
		</div>
	);
}
