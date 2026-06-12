"use client";

import { useEffect, useRef, useState } from "react";

import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

const TRACKING_PROGRESS = [
	{ count: "1032 / 1200", emoji: "👆", name: "Base Dex", pct: 86 },
	{ count: "492 / 1200", emoji: "✨", name: "Shiny Dex", pct: 41 },
	{ count: "276 / 1200", emoji: "🌑", name: "Shadow Dex", pct: 23 },
	{ count: "144 / 1200", emoji: "💯", name: "Hundo Dex", pct: 12 },
] as const;

const REGIONAL_PROGRESS = [
	{ name: "Kanto", pct: 92 },
	{ name: "Johto", pct: 78 },
	{ name: "Hoenn", pct: 65 },
	{ name: "Sinnoh", pct: 54 },
	{ name: "Unova", pct: 38 },
] as const;

const COTD_SLOTS = [
	{ emoji: "✨", name: "Larvitar", tag: "Shiny" },
	{ emoji: "👆", name: "Bagon", tag: "Base" },
	{ emoji: "🌑", name: "Gligar", tag: "Shadow" },
	{ emoji: "👆", name: "Spheal", tag: "Base" },
	{ emoji: "✨", name: "Beldum", tag: "Shiny" },
	{ emoji: "💯", name: "Numel", tag: "Hundo" },
	{ emoji: "👆", name: "Trapinch", tag: "Base" },
	{ emoji: "🍀", name: "Carvanha", tag: "Lucky" },
] as const;

function ProgressBar({
	pct,
	active,
	delay,
}: {
	pct: number;
	active: boolean;
	delay: number;
}) {
	return (
		<div className="h-2 w-full rounded-full bg-muted overflow-hidden">
			<div
				className="h-full rounded-full bg-primary transition-all ease-out"
				style={{
					transitionDelay: `${delay}ms`,
					transitionDuration: "1000ms",
					width: active ? `${pct}%` : "0%",
				}}
			/>
		</div>
	);
}

export function DashboardMockupSection() {
	const ref = useRef<HTMLDivElement>(null);
	const [active, setActive] = useState(false);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry?.isIntersecting) {
					setActive(true);
					observer.disconnect();
				}
			},
			{ threshold: 0.2 },
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	return (
		<section className="border-b border-border bg-muted/30" ref={ref}>
			<Container className="py-20" padded>
				<div className="flex flex-col items-center text-center mb-12 gap-3">
					<p className="font-mono text-[11px] uppercase tracking-widest text-primary">
						Your Dashboard
					</p>
					<h2 className="text-3xl font-bold tracking-tight">
						Everything, at a glance.
					</h2>
					<p className="text-muted-foreground text-sm max-w-md">
						A live snapshot of your collection. Numbers below are illustrative —
						yours will reflect your actual progress.
					</p>
				</div>

				<div className="grid lg:grid-cols-[1fr_1fr] gap-4">
					{/* Tracking Collections */}
					<div className="rounded-2xl border border-border bg-card p-5 flex flex-col gap-4">
						<p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
							Tracking Collections
						</p>
						<div className="flex flex-col gap-4">
							{TRACKING_PROGRESS.map(({ emoji, name, pct, count }, i) => (
								<div className="flex flex-col gap-1.5" key={name}>
									<div className="flex items-center justify-between text-sm">
										<span className="flex items-center gap-2 font-medium">
											<span>{emoji}</span>
											{name}
										</span>
										<span className="font-mono text-xs text-muted-foreground">
											{count}
										</span>
									</div>
									<ProgressBar active={active} delay={i * 120} pct={pct} />
								</div>
							))}
						</div>
					</div>

					{/* Right column: Regional + COTD */}
					<div className="flex flex-col gap-4">
						{/* Regional Breakdown */}
						<div className="rounded-2xl border border-border bg-card p-5 flex flex-col gap-4">
							<p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
								Regional Breakdown
							</p>
							<div className="flex flex-col gap-3">
								{REGIONAL_PROGRESS.map(({ name, pct }, i) => (
									<div className="flex items-center gap-3" key={name}>
										<span className="text-sm font-medium w-16 shrink-0">
											{name}
										</span>
										<ProgressBar
											active={active}
											delay={400 + i * 100}
											pct={pct}
										/>
										<span className="font-mono text-xs text-muted-foreground w-10 text-right">
											{pct}%
										</span>
									</div>
								))}
							</div>
						</div>

						{/* Catch of the Day */}
						<div className="rounded-2xl border border-border bg-card p-5 flex flex-col gap-4 flex-1">
							<div className="flex items-center justify-between">
								<p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
									Catch of the Day
								</p>
								<span className="font-mono text-[10px] text-primary bg-accent/40 px-2 py-0.5 rounded-full">
									8 slots
								</span>
							</div>
							<div className="grid grid-cols-4 gap-2">
								{COTD_SLOTS.map(({ emoji, name, tag }, i) => (
									<div
										className={cn(
											"flex flex-col items-center gap-1 p-2.5 rounded-xl border border-border bg-background transition-all duration-500 ease-out hover:border-primary hover:-translate-y-0.5 cursor-default",
											active
												? "opacity-100 translate-y-0"
												: "opacity-0 translate-y-3",
										)}
										key={name}
										style={{ transitionDelay: `${800 + i * 60}ms` }}
									>
										<span className="text-xl">{emoji}</span>
										<span className="text-[11px] font-medium text-center leading-tight">
											{name}
										</span>
										<span className="font-mono text-[9px] text-muted-foreground uppercase">
											{tag}
										</span>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</Container>
		</section>
	);
}
