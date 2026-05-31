"use client";

import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import type { PokemonCardContextValue } from "../pokemon/card/card.context";
import {
	ALL_VALID_COMBOS,
	computeTrackedSet,
	computeTrackedStates,
} from "../workspace/brush";

function EntryLogHeader({
	isBaseStateTracked,
	pokemon,
	pokemonDexFormatted,
	theme,
}: Partial<PokemonCardContextValue>) {
	return (
		<header className="flex flex-col gap-1">
			<div className="flex items-center gap-1">
				<span
					className={cn(
						"px-1.5 py-0.5 rounded-full font-mono text-[10px] uppercase",
						"transition-[color,background-color] duration-100",
						isBaseStateTracked
							? [theme?.badgeBg, theme?.badgeText]
							: "bg-slate-100 text-muted-foreground",
					)}
				>
					{pokemonDexFormatted}
				</span>
				<span className="text-muted-foreground/10">|</span>
				<span
					className={cn(
						"text-muted-foreground/50 text-xs inline-flex items-center gap-0.5",
						isBaseStateTracked && theme?.badgeText,
					)}
				>
					{isBaseStateTracked
						? "Base state tracked"
						: "Base state not tracked yet"}
				</span>
			</div>
			<p className="font-bold text-sm">{pokemon?.name || "UNKNOWN ENTRY"}</p>
		</header>
	);
}

function EntryLogMeta({
	statesTracked,
	statesTotal,
	lastModified,
}: {
	statesTracked: number;
	statesTotal: number;
	lastModified: string | null;
}) {
	return (
		<div className="flex items-center justify-between gap-1">
			<p className="text-xs text-muted-foreground">
				{statesTracked === 0
					? "No states tracked yet"
					: `${statesTracked} of ${statesTotal} states tracked`}
			</p>
			{lastModified && (
				<span className="text-xs text-muted-foreground">
					Last modified at {lastModified}
				</span>
			)}
		</div>
	);
}

export function PokedexEntryLog({
	pokemon,
	isBaseStateTracked,
	theme,
	pokemonDexFormatted,
}: PokemonCardContextValue) {
	const trackedSet = computeTrackedSet(pokemon.trackedStates);
	const statesTracked = computeTrackedStates(trackedSet);

	const statesTotal = ALL_VALID_COMBOS.length;
	const lastModified = pokemon.lastModifiedAt
		? new Date(pokemon.lastModifiedAt).toLocaleDateString("id-ID", {
				day: "2-digit",
				month: "2-digit",
				year: "numeric",
			})
		: null;

	return (
		<div className="flex flex-col gap-3">
			<EntryLogHeader
				isBaseStateTracked={isBaseStateTracked}
				pokemon={pokemon}
				pokemonDexFormatted={pokemonDexFormatted}
				theme={theme}
			/>
			<Separator />
			<ul
				className="grid grid-cols-2 gap-1"
				style={{
					gridAutoFlow: "column",
					gridTemplateRows: `repeat(${Math.ceil(statesTotal / 2)}, auto)`,
				}}
			>
				{ALL_VALID_COMBOS.map((combo) => {
					const tracked = trackedSet.has(combo.signature);
					return (
						<li
							className={cn(
								"flex items-center justify-between gap-4 text-xs px-2 py-1 rounded",
								"transition-[background-color,color] duration-100",
								tracked
									? [theme.badgeBg, theme.badgeText]
									: "text-muted-foreground/50",
							)}
							key={combo.signature}
						>
							<span>{combo.label}</span>
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
			<EntryLogMeta
				lastModified={lastModified}
				statesTotal={statesTotal}
				statesTracked={statesTracked}
			/>
		</div>
	);
}
