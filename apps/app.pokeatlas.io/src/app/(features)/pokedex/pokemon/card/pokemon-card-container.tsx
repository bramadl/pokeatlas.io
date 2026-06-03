import { cn } from "@/lib/utils";

interface PokemonCardContainerProps extends React.PropsWithChildren {
	children: React.ReactNode;
	isCardDisabled?: boolean;
	isPokemonTracked?: boolean;
	isTrackLogShown?: boolean;
}

export function PokemonCardContainer({
	children,
	isCardDisabled,
	isPokemonTracked,
	isTrackLogShown,
	...props
}: PokemonCardContainerProps) {
	return (
		<div
			className={cn(
				"relative group mt-10 bg-background drop-shadow-xl drop-shadow-black/5 rounded-lg",
				"scale-100 hover:scale-105 duration-300 fill-mode-both",
				isCardDisabled && "opacity-40 cursor-not-allowed pointer-events-none",
				isTrackLogShown && "scale-105",
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
