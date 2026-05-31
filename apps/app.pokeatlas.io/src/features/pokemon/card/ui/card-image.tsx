"use client";

import Image from "next/image";

import { cn } from "@/lib/utils";

import { usePokemonCard } from "../use-pokemon-card";

interface CardImageProps extends React.ComponentProps<"figure"> {
	priority?: boolean;
}

export function CardImage({
	className,
	priority = false,
	...props
}: CardImageProps) {
	const {
		hasShinyState,
		isPokemonTracked,
		pokemon,
		setIsTrackLogShown,
		theme,
	} = usePokemonCard();

	return (
		<figure
			className={cn(
				"absolute z-3 top-0 -translate-y-1/2 left-1/2 -translate-x-1/2",
				"size-20 p-2 rounded-full shadow-sm bg-linear-to-t to-white",
				"transition-[filter,box-shadow,background-image]",
				"group-hover:drop-shadow-2xl group-hover:shadow-none",
				isPokemonTracked ? theme.cardBg : "from-slate-100",
				className,
			)}
			{...props}
		>
			{/* ----- Pokemon Types ----- */}
			<div className="flex items-center absolute left-1/2 bottom-1 -translate-x-1/2 translate-y-1/2">
				{pokemon.types.map((t, _, types) => (
					<Image
						alt={t}
						className={cn("object-contain", types.length > 1 && "-mx-px")}
						height={20}
						key={t}
						priority={priority}
						src={`/pokemon-types/${t.toLowerCase()}.png`}
						width={20}
					/>
				))}
			</div>

			{/* ----- Pokemon Sprite: When the state contains a shiny, it turns shiny ----- */}
			<div className="relative size-full overflow-hidden">
				{pokemon.sprites.shinyUrl && (
					<Image
						alt={pokemon.name}
						className={cn(
							"object-contain p-1 transition-opacity",
							hasShinyState ? "opacity-100" : "opacity-0",
						)}
						fill
						priority={priority}
						sizes="64px"
						src={pokemon.sprites.shinyUrl}
					/>
				)}
				<Image
					alt={pokemon.name}
					className={cn(
						"object-contain p-1 transition-opacity",
						hasShinyState ? "opacity-0" : "opacity-100",
					)}
					fill
					priority={priority}
					sizes="64px"
					src={pokemon.sprites.url}
				/>
			</div>

			{/* ----- Pokemon Info: A button in which clicked, opens the track log ----- */}
			<button
				aria-label={`Inspect ${pokemon.name}`}
				className={cn(
					"absolute inset-0 z-1 rounded-full",
					"flex items-center justify-center outline-none",
					"opacity-0 bg-black/0 backdrop-blur-none",
					"transition-[opacity,background-colors,backdrop-filter,scale]",
					"hover:opacity-100 hover:bg-black/15 hover:backdrop-blur-[1px] hover:scale-95",
				)}
				onClick={(e) => {
					e.stopPropagation();
					setIsTrackLogShown(true);
				}}
				tabIndex={-1}
				type="button"
			>
				<span
					className={cn(
						"size-6 rounded-full flex items-center justify-center",
						"text-xs font-semibold",
						"bg-white/90 shadow-md",
						theme.badgeText,
					)}
				>
					i
				</span>
			</button>
		</figure>
	);
}
