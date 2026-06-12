"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

const STATES = [
	{ desc: "The standard catch.", emoji: "👆", name: "BASE" },
	{ desc: "The sparkle hunt.", emoji: "✨", name: "SHINY" },
	{ desc: "Team Rocket's finest.", emoji: "🌑", name: "SHADOW" },
	{ desc: "Redeemed from darkness.", emoji: "💫", name: "PURIFIED" },
	{ desc: "Trade-blessed IVs.", emoji: "🍀", name: "LUCKY" },
	{ desc: "100% IV perfection.", emoji: "💯", name: "HUNDO" },
	{ desc: "0% IV. Rarer than you think.", emoji: "⛔", name: "NUNDO" },
] as const;

type StateName = (typeof STATES)[number]["name"];

// Mutual exclusions — can't be selected together
const MUTUAL_EXCLUSIONS: Record<StateName, StateName[]> = {
	BASE: ["BASE", "SHINY", "SHADOW", "PURIFIED", "LUCKY", "HUNDO", "NUNDO"],
	HUNDO: ["BASE", "HUNDO", "NUNDO"],
	LUCKY: ["BASE", "LUCKY", "NUNDO", "SHADOW"],
	NUNDO: ["BASE", "HUNDO", "LUCKY", "PURIFIED", "NUNDO"],
	PURIFIED: ["BASE", "NUNDO", "SHADOW", "PURIFIED"],
	SHADOW: ["BASE", "LUCKY", "PURIFIED", "SHADOW"],
	SHINY: ["BASE", "SHINY"],
};

function getSignature(selected: Set<StateName>): string {
	if (selected.size === 0) return "—";
	return [...selected].sort().join("+");
}

function isBlocked(state: StateName, selected: Set<StateName>): boolean {
	if (selected.size === 0) return false;
	for (const s of selected) {
		if (MUTUAL_EXCLUSIONS[s].includes(state)) return true;
	}
	return false;
}

export function StatesSection() {
	const [selected, setSelected] = useState<Set<StateName>>(new Set());

	const toggle = (name: StateName) => {
		if (isBlocked(name, selected)) return;
		setSelected((prev) => {
			const next = new Set(prev);
			// BASE is solo-only
			if (name === "BASE") {
				return next.has("BASE") ? new Set() : new Set(["BASE"]);
			}
			if (next.has(name)) {
				next.delete(name);
			} else {
				next.add(name);
			}
			return next;
		});
	};

	const signature = getSignature(selected);

	return (
		<section className="border-b border-border">
			<Container className="py-20" padded>
				<div className="flex flex-col items-center text-center mb-12 gap-3">
					<p className="font-mono text-[11px] uppercase tracking-widest text-primary">
						The system
					</p>
					<h2 className="text-3xl font-bold tracking-tight">
						One Pokémon. Multiple truths.
					</h2>
					<p className="text-muted-foreground text-sm max-w-md">
						Most trackers record a single caught/not-caught state. PokéPulse
						tracks all 7 simultaneously — click the cards below to build a
						signature.
					</p>
				</div>

				{/* Interactive state cards */}
				<div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
					{STATES.map(({ emoji, name, desc }) => {
						const isSelected = selected.has(name);
						const blocked = isBlocked(name, selected);
						return (
							<button
								className={cn(
									"flex flex-col items-center gap-2 p-4 rounded-2xl border text-center transition-all duration-200 cursor-pointer select-none",
									"hover:scale-105 active:scale-95",
									isSelected
										? "border-primary bg-accent/50 shadow-sm"
										: "border-border bg-card hover:border-primary/50 hover:bg-accent/20",
									blocked && "opacity-30 cursor-not-allowed hover:scale-100",
								)}
								disabled={blocked}
								key={name}
								onClick={() => toggle(name)}
								type="button"
							>
								<span
									className={cn(
										"text-3xl transition-transform duration-200",
										isSelected && "scale-110",
									)}
								>
									{emoji}
								</span>
								<span className="font-mono text-[10px] uppercase tracking-wider text-primary font-semibold">
									{name}
								</span>
								<span className="text-xs text-muted-foreground leading-tight hidden sm:block">
									{desc}
								</span>
							</button>
						);
					})}
				</div>

				{/* Signature result */}
				<div className="flex flex-col items-center gap-4">
					<div className="flex items-center gap-3 px-6 py-4 rounded-2xl border border-border bg-card min-w-72 justify-center transition-all duration-300">
						<span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
							Signature
						</span>
						<span
							className={cn(
								"font-mono text-sm font-semibold transition-all duration-300",
								selected.size > 0 ? "text-primary" : "text-muted-foreground",
							)}
						>
							{signature}
						</span>
					</div>

					{selected.size > 0 && (
						<div className="flex flex-col items-center gap-1 animate-in fade-in slide-in-from-bottom-2 duration-300">
							<p className="text-xs text-muted-foreground">
								{selected.size === 1 && selected.has("BASE")
									? "Tracked in your Base Dex"
									: `Counts toward ${selected.size} Dex${selected.size > 1 ? "es" : ""} simultaneously`}
							</p>
							<button
								className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
								onClick={() => setSelected(new Set())}
								type="button"
							>
								clear
							</button>
						</div>
					)}

					{selected.size === 0 && (
						<p className="text-xs text-muted-foreground animate-in fade-in duration-300">
							Tap any state above to build a signature
						</p>
					)}
				</div>

				{/* Static example signatures */}
				<div className="mt-10 flex justify-center">
					<div className="inline-flex flex-wrap justify-center gap-2 px-6 py-4 rounded-2xl border border-border bg-muted/30 max-w-xl">
						<span className="w-full text-center font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-1">
							24 valid combinations — a few examples
						</span>
						{[
							"BASE",
							"SHINY",
							"SHADOW",
							"HUNDO+SHINY",
							"SHADOW+SHINY",
							"NUNDO+SHINY",
							"HUNDO+LUCKY+SHINY",
							"HUNDO+LUCKY+PURIFIED",
						].map((sig) => (
							<Badge
								className="font-mono text-[11px] text-primary border-primary/20 bg-accent/30 hover:bg-accent/60 transition-colors cursor-default"
								key={sig}
								variant="outline"
							>
								{sig}
							</Badge>
						))}
					</div>
				</div>
			</Container>
		</section>
	);
}
