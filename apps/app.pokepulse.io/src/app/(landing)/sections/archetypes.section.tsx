"use client";

import { useState } from "react";

import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

const ARCHETYPES = [
	{
		detail:
			"Your Shiny Dex outpaces every other collection. Every walk is a sparkle hunt — and it shows.",
		emoji: "✨",
		name: "Shiny Chaser",
		teaser: "Most-tracked state: Shiny",
	},
	{
		detail:
			"100% IVs or nothing. Your collection skews toward perfection, one stat-checked catch at a time.",
		emoji: "💯",
		name: "Hundo Hunter",
		teaser: "Most-tracked state: Hundo",
	},
	{
		detail:
			"Team Rocket can't hide from you. Your Shadow Dex is your pride — purified or not.",
		emoji: "🌑",
		name: "Shadow Tamer",
		teaser: "Most-tracked state: Shadow",
	},
	{
		detail:
			"Catch 'em all, literally. Your Base Dex is closest to 100% — gaps are personal.",
		emoji: "�",
		name: "Living Dex Completionist",
		teaser: "Highest overall Base completion",
	},
	{
		detail:
			"Costumes, regional forms, Mega evolutions — if it's a variant, you've got an eye for it.",
		emoji: "🔮",
		name: "Variant Collector",
		teaser: "Most-tracked: alternate forms",
	},
] as const;

export function ArchetypesSection() {
	const [flipped, setFlipped] = useState<string | null>(null);

	return (
		<section className="border-b border-border bg-muted/30">
			<Container className="py-20" padded>
				<div className="flex flex-col items-center text-center mb-12 gap-3">
					<p className="font-mono text-[11px] uppercase tracking-widest text-primary">
						Collection Insights
					</p>
					<h2 className="text-3xl font-bold tracking-tight">
						Which trainer are you?
					</h2>
					<p className="text-muted-foreground text-sm max-w-md">
						PokéPulse analyzes your tracking patterns daily and assigns you a
						collector archetype. Tap a card to see what defines each one.
					</p>
				</div>

				<div
					className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3"
					style={{ perspective: "1000px" }}
				>
					{ARCHETYPES.map(({ emoji, name, teaser, detail }) => {
						const isFlipped = flipped === name;
						return (
							<button
								className="relative h-44 text-left cursor-pointer group transform-3d transition-transform duration-500"
								key={name}
								onClick={() => setFlipped(isFlipped ? null : name)}
								style={{
									transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
								}}
                type="button"
							>
								{/* Front */}
								<div
									className={cn(
										"absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card p-4 backface-hidden",
										"group-hover:border-primary/50 transition-colors duration-200",
									)}
								>
									<span className="text-4xl transition-transform duration-200 group-hover:scale-110">
										{emoji}
									</span>
									<p className="font-semibold text-sm text-center">{name}</p>
									<p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider text-center">
										{teaser}
									</p>
								</div>

								{/* Back */}
								<div
									className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-2xl border border-primary/40 bg-accent/40 p-4 backface-hidden"
									style={{ transform: "rotateY(180deg)" }}
								>
									<p className="text-xs text-foreground leading-relaxed text-center">
										{detail}
									</p>
								</div>
							</button>
						);
					})}
				</div>

				<p className="text-center text-xs text-muted-foreground mt-6">
					Requires at least 10 tracked Pokémon in a collection to appear on your
					Dashboard.
				</p>
			</Container>
		</section>
	);
}
