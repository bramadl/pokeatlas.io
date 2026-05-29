import { cn } from "@/lib/utils";

import { usePokemonCard } from "../use-pokemon-card";

export function CardContainer({
	children,
	...props
}: {
	children: React.ReactNode;
}) {
	const { displayedStates, isTrackLogShown } = usePokemonCard();
	const isTracked = displayedStates.length > 0;

	return (
		<div
			className={cn(
				"relative group mt-10 bg-background drop-shadow-xl drop-shadow-black/5 rounded-lg",
				"transition-[scale,opacity,filter] duration-300 will-change-[scale]",
				"scale-100 hover:scale-105",
				isTrackLogShown && "scale-105",
				isTracked ? "opacity-100" : "opacity-75 grayscale",
			)}
			{...props}
		>
			{children}
		</div>
	);
}
