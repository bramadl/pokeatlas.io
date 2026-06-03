import type { PokemonType } from "@pokeatlas/core";
import Image from "next/image";

import { cn } from "@/lib/utils";

import type { PokemonCardTheme } from "./pokemon-card.theme";

interface PokemonCardImageProps extends React.ComponentProps<"figure"> {
	hasShinyState?: boolean;
	onInfoClicked?: (e: React.MouseEvent<HTMLButtonElement>) => void;
	pokemonName: string;
	pokemonSprite: {
		default: string;
		shiny: string | null;
	};
	pokemonTypes: PokemonType[];
	priority?: boolean;
	theme: PokemonCardTheme;
	tracked?: boolean;
}

export function PokemonCardImage({
	className,
	hasShinyState,
	onInfoClicked,
	pokemonName,
	pokemonSprite,
	pokemonTypes,
	priority = false,
	theme,
	tracked,
	...props
}: PokemonCardImageProps) {
	return (
		<figure
			className={cn(
				"absolute z-3 top-0 -translate-y-1/2 left-1/2 -translate-x-1/2",
				"size-20 p-2 rounded-full shadow-sm bg-linear-to-t to-background",
				"transition-all group-hover:drop-shadow-2xl group-hover:shadow-none",
				tracked
					? cn("ring-2 ring-background shadow-lg", theme.cardBg)
					: "from-slate-100",
				className,
			)}
			{...props}
		>
			<div className="flex items-center absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2">
				{pokemonTypes.map((t, _, types) => (
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

			<div className="relative size-full overflow-hidden">
				{pokemonSprite.shiny && (
					<Image
						alt={pokemonName}
						className={cn(
							"object-contain p-1 transition-opacity",
							hasShinyState ? "opacity-100" : "opacity-0",
						)}
						fill
						priority={priority}
						sizes="64px"
						src={pokemonSprite.shiny}
					/>
				)}
				<Image
					alt={pokemonName}
					className={cn(
						"object-contain p-1 transition-opacity",
						hasShinyState ? "opacity-0" : "opacity-100",
					)}
					fill
					priority={priority}
					sizes="64px"
					src={pokemonSprite.default}
				/>
			</div>

			<button
				aria-label={`Inspect ${pokemonName}`}
				className={cn(
					"absolute inset-0 z-1 rounded-full",
					"flex items-center justify-center outline-none",
					"opacity-0 bg-black/0 backdrop-blur-none",
					"transition-[opacity,background-colors,backdrop-filter,scale]",
					"hover:opacity-100 hover:bg-black/15 hover:backdrop-blur-[1px] hover:scale-95",
				)}
				onClick={onInfoClicked}
				tabIndex={-1}
				type="button"
			>
				<span
					className={cn(
						"size-6 rounded-full flex items-center justify-center",
						"text-xs font-semibold",
						"bg-background/90 shadow-md",
						theme.badgeText,
					)}
				>
					i
				</span>
			</button>
		</figure>
	);
}
