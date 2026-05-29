import Image from "next/image";

import { cn } from "@/lib/utils";

import { getPokemonTheme, isPokemonTracked } from "../card.utils";
import { usePokemonCard } from "../use-pokemon-card";

export function CardImage({ priority }: { priority?: boolean }) {
	const { pokemon, setIsTrackLogShown } = usePokemonCard();
	const theme = getPokemonTheme(pokemon);

	return (
		<figure
			className={cn(
				"absolute z-3 top-0 -translate-y-1/2 left-1/2 -translate-x-1/2",
				"size-20 p-2 rounded-full shadow-sm bg-linear-to-t to-white",
				"transition-[filter,box-shadow,background-image] duration-300",
				"group-hover:drop-shadow-2xl group-hover:shadow-none",
				isPokemonTracked(pokemon) ? theme.cardBg : "from-slate-300",
			)}
		>
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

			<div className="relative size-full overflow-hidden">
				<Image
					alt={pokemon.name}
					className="object-contain p-1"
					fill
					priority={priority}
					sizes="64px"
					src={pokemon.sprites.url}
				/>
			</div>

			<button
				aria-label={`Inspect ${pokemon.name}`}
				className={cn(
					"absolute inset-0 z-20 rounded-full",
					"flex items-center justify-center outline-none",
					"opacity-0 bg-black/0 backdrop-blur-none",
					"transition-[opacity,background-colors,backdrop-filter,scale] duration-300",
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

// import Image from "next/image";

// import { cn } from "@/lib/utils";

// import { getPokemonTheme, isPokemonTracked } from "../card.utils";
// import { usePokemonCard } from "../use-pokemon-card";

// export function CardImage({ priority }: { priority?: boolean }) {
// 	const {
// 		// Added
// 		displayedStates,
// 		pokemon,
// 		setIsTrackLogShown,
// 	} = usePokemonCard();
// 	const theme = getPokemonTheme(pokemon);
// 	const isTracked = displayedStates.length > 0;

// 	return (
// 		<figure
// 			className={cn(
// 				"absolute z-3 top-0 -translate-y-1/2 left-1/2 -translate-x-1/2",
// 				"size-20 p-2 rounded-full shadow-sm bg-linear-to-t to-white",
// 				"transition-[filter,box-shadow,background-image] duration-300",
// 				"group-hover:drop-shadow-2xl group-hover:shadow-none",
// 				// isPokemonTracked(pokemon) ? theme.cardBg : "from-slate-300",
// 				isTracked ? theme.cardBg : "from-slate-300",
// 			)}
// 		>
// 			<div className="flex items-center absolute left-1/2 bottom-1 -translate-x-1/2 translate-y-1/2">
// 				{pokemon.types.map((t, _, types) => (
// 					<Image
// 						alt={t}
// 						className={cn("object-contain", types.length > 1 && "-mx-px")}
// 						height={20}
// 						key={t}
// 						priority={priority}
// 						src={`/pokemon-types/${t.toLowerCase()}.png`}
// 						width={20}
// 					/>
// 				))}
// 			</div>

// 			<div className="relative size-full overflow-hidden">
// 				<Image
// 					alt={pokemon.name}
// 					className="object-contain p-1"
// 					fill
// 					priority={priority}
// 					sizes="64px"
// 					src={pokemon.sprites.url}
// 				/>
// 			</div>

// 			<button
// 				aria-label={`Inspect ${pokemon.name}`}
// 				className={cn(
// 					"absolute inset-0 z-20 rounded-full",
// 					"flex items-center justify-center outline-none",
// 					"opacity-0 bg-black/0 backdrop-blur-none",
// 					"transition-[opacity,background-colors,backdrop-filter] duration-300",
// 					"hover:opacity-100 hover:bg-black/15 hover:backdrop-blur-[1px]",
// 				)}
// 				onClick={(e) => {
// 					e.stopPropagation();
// 					setIsTrackLogShown(true);
// 				}}
// 				tabIndex={-1}
// 				type="button"
// 			>
// 				<span
// 					className={cn(
// 						"size-6 rounded-full flex items-center justify-center",
// 						"text-xs font-semibold",
// 						"bg-white/90 shadow-md",
// 						theme.badgeText,
// 					)}
// 				>
// 					i
// 				</span>
// 			</button>
// 		</figure>
// 	);
// }
