"use client";

import { useEffect, useRef, useState } from "react";

import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

const STATS = [
	{ label: "Tracking states", sub: "per Pokémon entry", value: 7 },
	{ label: "Valid signatures", sub: "unique state combinations", value: 24 },
	{ label: "Regional Pokédexes", sub: "incl. National", value: 11 },
	{ label: "Daily curated slots", sub: "re-scored every midnight", value: 8 },
	{
		label: "Classifications",
		sub: "Standard, Legendary, Mythic, UB",
		value: 4,
	},
	{ label: "Dex achievements", sub: "auto-awarded as you complete", value: 6 },
] as const;

function AnimatedNumber({
	target,
	active,
}: {
	target: number;
	active: boolean;
}) {
	const [current, setCurrent] = useState(0);

	useEffect(() => {
		if (!active) return;
		let frame: number;
		const start = performance.now();
		const duration = 900;

		const tick = (now: number) => {
			const p = Math.min((now - start) / duration, 1);
			const eased = 1 - (1 - p) ** 3;
			setCurrent(Math.round(eased * target));
			if (p < 1) frame = requestAnimationFrame(tick);
		};
		frame = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(frame);
	}, [active, target]);

	return <span>{current}</span>;
}

export function StatsSection() {
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
			{ threshold: 0.3 },
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	return (
		<section className="border-b border-border bg-muted/30" ref={ref}>
			<Container className="py-16" padded>
				<p className="font-mono text-[11px] uppercase tracking-widest text-primary text-center mb-10">
					Built for depth
				</p>
				<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
					{STATS.map(({ value, label, sub }, i) => (
						<div
							className={cn(
								"flex flex-col items-center text-center gap-1 transition-all duration-500 ease-out",
								active
									? "opacity-100 translate-y-0"
									: "opacity-0 translate-y-4",
							)}
							key={label}
							style={{ transitionDelay: `${i * 80}ms` }}
						>
							<span className="text-4xl font-bold tracking-tight text-primary font-mono">
								<AnimatedNumber active={active} target={value} />
							</span>
							<span className="text-sm font-semibold text-foreground">
								{label}
							</span>
							<span className="text-xs text-muted-foreground leading-tight text-center">
								{sub}
							</span>
						</div>
					))}
				</div>
			</Container>
		</section>
	);
}
