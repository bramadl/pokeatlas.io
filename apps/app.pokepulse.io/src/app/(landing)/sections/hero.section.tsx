"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AuthPopupButton } from "@/app/(auth)/popup/auth-popup-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

const TRACKING_STATES = [
	{ emoji: "👆", name: "Base" },
	{ emoji: "✨", name: "Shiny" },
	{ emoji: "🌑", name: "Shadow" },
	{ emoji: "💫", name: "Purified" },
	{ emoji: "🍀", name: "Lucky" },
	{ emoji: "💯", name: "Hundo" },
	{ emoji: "⛔", name: "Nundo" },
] as const;

const HERO_FEATURES = [
	{ emoji: "🎯", label: "7 tracking states", sub: "per Pokémon" },
	{ emoji: "📖", label: "11 regional Pokédexes", sub: "Kanto → Paldea" },
	{ emoji: "🌟", label: "Catch of the Day", sub: "scored daily for you" },
	{ emoji: "💡", label: "Collection Insights", sub: "know your archetype" },
] as const;

export function HeroSection() {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const t = setTimeout(() => setVisible(true), 50);
		return () => clearTimeout(t);
	}, []);

	return (
		<section className="relative border-b border-border overflow-hidden">
			{/* Ambient glow */}
			<div
				aria-hidden
				className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 size-175 rounded-full bg-primary/8 blur-[140px]"
			/>

			<Container className="relative py-20 sm:py-28" padded>
				<div className="grid lg:grid-cols-[1fr_360px] gap-12 items-center">
					{/* Left — headline + CTA */}
					<div className="flex flex-col gap-6">
						<div
							className={cn(
								"transition-all duration-700 ease-out",
								visible
									? "opacity-100 translate-y-0"
									: "opacity-0 translate-y-4",
							)}
						>
							<Badge className="font-mono text-xs mb-4" variant="secondary">
								For hardcore Pokémon GO trainers
							</Badge>
							<h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.05]">
								Every catch.
								<br />
								<span className="text-primary">Every state.</span>
								<br />
								All tracked.
							</h1>
						</div>

						<p
							className={cn(
								"text-muted-foreground text-base sm:text-lg max-w-md leading-relaxed transition-all duration-700 delay-150 ease-out",
								visible
									? "opacity-100 translate-y-0"
									: "opacity-0 translate-y-4",
							)}
						>
							PokéPulse tracks your Pokémon GO collection across 7 independent
							states. No spreadsheets. No guesswork. Just your Dex, done right.
						</p>

						<div
							className={cn(
								"flex flex-col sm:flex-row items-start gap-3 transition-all duration-700 delay-300 ease-out",
								visible
									? "opacity-100 translate-y-0"
									: "opacity-0 translate-y-4",
							)}
						>
							<AuthPopupButton className="group">
								Start tracking — it&apos;s free
								<span className="ml-1 transition-transform duration-200 group-hover:translate-x-1 inline-block">
									→
								</span>
							</AuthPopupButton>
							<Button asChild size="lg" variant="ghost">
								<Link href="/guides">Read the guide</Link>
							</Button>
						</div>

						{/* State pills */}
						<div
							className={cn(
								"flex flex-wrap gap-2 transition-all duration-700 delay-500 ease-out",
								visible
									? "opacity-100 translate-y-0"
									: "opacity-0 translate-y-4",
							)}
						>
							{TRACKING_STATES.map(({ emoji, name }, i) => (
								<span
									className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card text-sm text-muted-foreground hover:border-primary hover:text-foreground transition-colors duration-200 cursor-default"
									key={name}
									style={{ transitionDelay: `${600 + i * 50}ms` }}
								>
									<span>{emoji}</span>
									<span className="font-medium text-foreground">{name}</span>
								</span>
							))}
						</div>
					</div>

					{/* Right — feature cards stack */}
					<div
						className={cn(
							"hidden lg:flex flex-col gap-3 transition-all duration-700 delay-200 ease-out",
							visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8",
						)}
					>
						{HERO_FEATURES.map(({ emoji, label, sub }, i) => (
							<div
								className="flex items-center gap-4 px-5 py-4 rounded-2xl border border-border bg-card hover:border-primary/50 hover:bg-accent/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm cursor-default group"
								key={label}
								style={{ transitionDelay: `${300 + i * 80}ms` }}
							>
								<span className="text-2xl group-hover:scale-110 transition-transform duration-200">
									{emoji}
								</span>
								<div>
									<p className="font-semibold text-sm text-foreground">
										{label}
									</p>
									<p className="text-xs text-muted-foreground">{sub}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</Container>
		</section>
	);
}
