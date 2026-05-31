"use client";

import { cn } from "@/lib/utils";

import { usePokemonCard } from "../use-pokemon-card";

interface CardContainerProps extends React.ComponentProps<"div"> {
	children: React.ReactNode;
}

export function CardContainer({
	className,
	children,
	...props
}: CardContainerProps) {
	const { isDisabled, isPokemonTracked, isTrackLogShown } = usePokemonCard();

	return (
		<div
			className={cn(
				"relative group mt-10 bg-background drop-shadow-xl drop-shadow-black/5 rounded-lg",
				"scale-100 hover:scale-105 duration-300 fill-mode-both",
				isDisabled && "opacity-40 cursor-not-allowed pointer-events-none",
				isTrackLogShown && "scale-105",
				className,
			)}
			{...props}
		>
			<div
				className={cn(
					"size-full rounded-lg transition-[opacity,filter] duration-300",
					!isPokemonTracked && "opacity-75 grayscale",
				)}
			>
				{children}
			</div>
		</div>
	);
}
