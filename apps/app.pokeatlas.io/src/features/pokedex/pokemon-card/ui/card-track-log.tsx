import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import { usePokemonCard } from "../card.context";
import { getPokemonDex, getPokemonTheme } from "../card.utils";

export function CardTrackLog() {
	const { displayedStates, pokemon } = usePokemonCard();

	const theme = getPokemonTheme(pokemon);
	const isTracked = displayedStates.length > 0;

	return (
		<div className="flex flex-col gap-3">
			<header className="flex flex-col gap-1">
				<div className="flex items-center gap-1">
					<span
						className={cn(
							"px-1.5 py-0.5 rounded-full font-mono text-[10px] uppercase",
							"transition-[color,background-color] duration-100",
							isTracked
								? [theme.badgeBg, theme.badgeText]
								: "bg-slate-100 text-muted-foreground",
						)}
					>
						{getPokemonDex(pokemon)}
					</span>
					<span className="text-muted-foreground/10">|</span>
					<span
						className={cn(
							"text-muted-foreground text-xs inline-flex items-center gap-0.5",
							isTracked && "text-green-500",
						)}
					>
						{isTracked ? "Base species caught" : "Not caught yet"}
					</span>
				</div>
				<p className="font-bold text-sm">{pokemon.name}</p>
			</header>

			<Separator />

			<ul
				className="grid grid-cols-2 gap-1"
				style={{
					gridAutoFlow: "column",
					// gridTemplateRows: `repeat(${half}, auto)`,
				}}
			>
				{/* {combos.map((combo) => (
					<li
						className={cn(
							"flex items-center justify-between gap-4 text-xs px-2 py-1 rounded",
							combo.isTracked
								? "bg-green-50 text-green-800"
								: "text-muted-foreground",
						)}
						key={combo.signature}
					>
						<span>{combo.label}</span>
						<span
							className={cn(
								"font-mono text-[10px]",
								combo.isTracked ? "text-green-600" : "text-muted-foreground/50",
							)}
						>
							{combo.isTracked ? "✓" : "–"}
						</span>
					</li>
				))} */}
			</ul>

			<Separator />

			<div className="flex items-center justify-between gap-1">
				<p className="text-xs text-muted-foreground">
					{/* {trackedCount === 0
						? "No states tracked yet"
						: `${trackedCount} of ${combos.length} states tracked`} */}
				</p>

				{pokemon.lastModifiedAt && (
					<span className="text-xs text-muted-foreground">
						Last modified at {pokemon.lastModifiedAt.getDate()}
					</span>
				)}
			</div>
		</div>
	);
}
