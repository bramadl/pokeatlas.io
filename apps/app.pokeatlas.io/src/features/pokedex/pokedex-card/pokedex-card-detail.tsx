import { useMemo } from "react";

import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import { TYPE_THEME } from "../pokedex-theme";
import type { PokedexEntry } from "../types";
import { getAllPossibleCombinations } from "./pokedex-card.helpers";

interface PokedexCardDetailProps {
	pokemon: PokedexEntry;
}

export function PokedexCardDetail({ pokemon: p }: PokedexCardDetailProps) {
	const combos = getAllPossibleCombinations(p.trackedStates);
	const half = Math.ceil(combos.length / 2);

	const isCaught = p.trackedStates.includes("BASE");
	const trackedCount = combos.filter((c) => c.isTracked).length;

	const typeKey = (
		p.types[0] as string
	).toLowerCase() as keyof typeof TYPE_THEME;
	const theme = TYPE_THEME[typeKey];

	const modifiedAt = useMemo(() => {
		const date = new Date(p.lastModifiedAt)
			.toLocaleDateString("en-GB", {
				day: "2-digit",
				month: "2-digit",
				year: "numeric",
			})
			.replace(/\//g, "/");

		return date;
	}, [p]);

	return (
		<div className="flex flex-col gap-3">
			<header className="flex flex-col gap-1">
				<div className="flex items-center gap-1">
					<span
						className={cn(
							"self-start px-1.5 py-0.5 rounded-full font-mono text-[10px]",
							theme?.badgeBg,
							theme?.badgeText,
						)}
					>
						{`#${String(p.dex).padStart(3, "0")}`}
					</span>
					<span className="text-muted-foreground/10">|</span>
					<span
						className={cn(
							"text-muted-foreground text-xs inline-flex items-center gap-0.5",
							isCaught && "text-green-500",
						)}
					>
						{isCaught ? "Base species caught" : "Not caught yet"}
					</span>
				</div>
				<p className="font-bold text-sm">{p.name}</p>
			</header>

			<Separator />

			<ul
				className="grid grid-cols-2 gap-x-4 gap-y-1"
				style={{
					gridAutoFlow: "column",
					gridTemplateRows: `repeat(${half}, auto)`,
				}}
			>
				{combos.map((combo) => (
					<li
						className={cn(
							"flex items-center justify-between gap-2 text-xs px-2 py-1 rounded",
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
				))}
			</ul>

			<Separator />

			<div className="flex items-center justify-between gap-1">
				<p className="text-xs text-muted-foreground">
					{trackedCount === 0
						? "No states tracked yet"
						: `${trackedCount} of ${combos.length} combinations tracked`}
				</p>
				<span className="text-xs text-muted-foreground">
					Last modified at {modifiedAt}
				</span>
			</div>
		</div>
	);
}
