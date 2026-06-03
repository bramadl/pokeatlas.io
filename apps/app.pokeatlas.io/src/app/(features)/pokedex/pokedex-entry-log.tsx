import type { PokedexEntry } from "@pokeatlas/core";
import { format } from "date-fns";

import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import type { PokemonCardTheme } from "./pokemon/card/pokemon-card.theme";
import { getAllValidSignatures } from "./workspace/tracking/tracking-signature.utils";

interface PokedexEntryLogProps {
	entry: PokedexEntry;
	isEntryTracked?: boolean;
	pokedex: string;
	theme: PokemonCardTheme;
}

export function PokedexEntryLog({
	entry,
	pokedex,
	theme,
}: PokedexEntryLogProps) {
	const ALL_VALID_SIGNATURES = getAllValidSignatures();

	return (
		<aside className="flex flex-col gap-3">
			<header className="flex flex-col">
				<div className="flex items-center gap-1">
					<span
						className={cn(
							"px-1.5 py-0.5 rounded-full font-mono text-[10px] uppercase",
							"transition-[color,background-color] duration-100",
							"bg-slate-100 text-muted-foreground",
						)}
					>
						{pokedex}
					</span>
					<span className="text-muted-foreground/10">|</span>
					<span
						className={cn(
							"px-1.5 py-0.5 rounded-full font-mono text-[10px] capitalize",
							"transition-[color,background-color] duration-100",
							"bg-slate-100 text-muted-foreground",
						)}
					>
						{entry.species.region.toLowerCase()}
					</span>
				</div>
				<h3 className="font-bold text-sm">{entry.species.name}</h3>
			</header>
			<Separator />
			<ul
				className="grid grid-cols-2 gap-1"
				style={{
					gridAutoFlow: "column",
					gridTemplateRows: `repeat(${Math.ceil(ALL_VALID_SIGNATURES.length / 2)}, auto)`,
				}}
			>
				{ALL_VALID_SIGNATURES.map((signature) => {
					const tracked = entry.trackedStates.some((s) => s === signature);
					const label = signature
						.split("+")
						.map((s) => s.at(0)?.toUpperCase() + s.slice(1).toLowerCase())
						.join(" ");

					return (
						<li
							className={cn(
								"flex items-center justify-between gap-4 text-xs px-2 py-1 rounded",
								"transition-[background-color,color] duration-100",
								tracked
									? ["font-bold", theme.badgeBg, theme.badgeText]
									: "text-muted-foreground/50",
							)}
							key={signature}
						>
							<span>{label}</span>
							<span
								className={cn(
									"font-mono text-[10px]",
									tracked ? theme.badgeText : "text-muted-foreground/50",
								)}
							>
								{tracked ? "✓" : "–"}
							</span>
						</li>
					);
				})}
			</ul>
			<Separator />
			<footer className="flex items-center justify-between gap-1">
				<p className="text-xs text-muted-foreground">
					{entry.trackedStates.length === 0
						? "No states tracked yet"
						: `${entry.trackedStates.length} of ${ALL_VALID_SIGNATURES.length} states tracked`}
				</p>
				{entry.lastModifiedAt && (
					<span className="text-xs text-muted-foreground">
						Last modified at {format(entry.lastModifiedAt, "MM/dd/yyyy")}
					</span>
				)}
			</footer>
		</aside>
	);
}
