"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import type { TrackedPokemonEntry } from "@/app/account/profile/api/profile.actions";
import { cn } from "@/lib/utils";

export type ReelEntry = TrackedPokemonEntry;

interface HighlightReelsProps {
	entries: ReelEntry[];
}

const RINGS = [
	{ count: 6, dir: 1, size: 48, speed: 0.04 },
	{ count: 8, dir: -1, size: 36, speed: 0.025 },
	{ count: 10, dir: 1, size: 26, speed: 0.016 },
] as const;

const RING_RADII = [0.22, 0.36, 0.5] as const;
const TOTAL_SLOTS = RINGS.reduce((s, r) => s + r.count, 0);

export function HighlightReels({ entries }: HighlightReelsProps) {
	const stageRef = useRef<HTMLDivElement>(null);
	const rafRef = useRef<number>(0);

	const isEmpty = entries.length === 0;
	const [featured, ...rest] = entries;

	const slots: (ReelEntry | null)[] = Array.from(
		{ length: TOTAL_SLOTS },
		(_, i) => rest[i] ?? null,
	);

	useEffect(() => {
		const stage = stageRef.current;
		if (!stage || isEmpty) return;

		const satellites = stage.querySelectorAll<HTMLElement>("[data-satellite]");
		let elapsed = 0;
		let lastTs: number | null = null;

		const meta = Array.from(satellites).map((el) => ({
			baseAngle: parseFloat(el.dataset.baseAngle as string),
			el,
			ringIdx: parseInt(el.dataset.ringIdx as string, 10),
		}));

		function tick(ts: number) {
			if (!lastTs) lastTs = ts;
			elapsed += (ts - lastTs) / 1000;
			lastTs = ts;

			const W = (stage as HTMLDivElement).offsetWidth;
			const H = (stage as HTMLDivElement).offsetHeight;
			const cx = W / 2;
			const cy = H / 2;

			meta.forEach(({ el, ringIdx, baseAngle }) => {
				const ring = RINGS[ringIdx] as (typeof RINGS)[number];
				const radius = (RING_RADII[ringIdx] as number) * W;
				const angle =
					baseAngle +
					((elapsed * ring.speed * ring.dir * Math.PI * 2) / 60) * 60;

				const x = cx + Math.cos(angle) * radius;
				const y = cy + Math.sin(angle) * radius;

				const sinA = Math.sin(angle);

				const scale = 0.6 + (sinA + 1) * 0.25;
				const opacity = 0.25 + (sinA + 1) * 0.375;
				const zIndex = Math.round(10 + sinA * 35);

				el.style.left = `${x}px`;
				el.style.top = `${y}px`;
				el.style.transform = `translate(-50%, -50%) scale(${scale.toFixed(3)})`;
				el.style.opacity = opacity.toFixed(3);
				el.style.zIndex = String(zIndex);
			});

			rafRef.current = requestAnimationFrame(tick);
		}

		rafRef.current = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(rafRef.current);
	}, [isEmpty]);

	if (isEmpty) {
		return (
			<div className="flex flex-col items-center justify-center gap-2 py-10 text-center text-muted-foreground">
				<span className="text-3xl">🎴</span>
				<p className="text-sm font-medium">No Pokémon tracked yet</p>
				<p className="text-xs">
					Start tracking in the Pokédex and they&apos;ll appear here.
				</p>
			</div>
		);
	}

	return (
		<div
			className="relative w-full h-full overflow-hidden select-none"
			ref={stageRef}
			style={{ height: 320 }}
		>
			{RING_RADII.map((r, i) => (
				<div
					aria-hidden
					className="absolute rounded-full border border-border/10 pointer-events-none"
					key={r}
					style={{
						height: `${r * 2 * 100}%`,
						left: "50%",
						opacity: 0.5 - i * 0.12,
						top: "50%",
						transform: "translate(-50%, -50%)",
						width: `${r * 2 * 100}%`,
					}}
				/>
			))}

			{(() => {
				let slotIdx = 0;
				return RINGS.map((ring, ringIdx) =>
					Array.from({ length: ring.count }).map((_, i) => {
						const entry = slots[slotIdx++] ?? null;
						const baseAngle = (i / ring.count) * Math.PI * 2;

						return (
							<div
								className={cn(
									"absolute rounded-full flex items-center justify-center overflow-hidden",
									"border bg-background transition-[border-color] duration-300",
									entry
										? "border-border/40 shadow-sm"
										: "border-dashed border-border/20",
								)}
								data-base-angle={baseAngle}
								data-ring-idx={ringIdx}
								data-satellite
								key={`r${ringIdx.toString()}-s${i.toString()}`}
								style={{
									height: ring.size,
									left: -ring.size,
									top: -ring.size,
									width: ring.size,
								}}
								title={entry?.name}
							>
								{entry && (
									<Image
										alt={entry.name}
										className="object-contain p-0.5"
										fill
										sizes={`${ring.size}px`}
										src={entry.spriteUrl}
									/>
								)}
							</div>
						);
					}),
				);
			})()}

			{featured && (
				<div
					className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5"
					style={{ zIndex: 50 }}
				>
					<div
						className={cn(
							"relative size-24 rounded-full",
							"border-2 border-primary/30 bg-primary/5",
							"ring-4 ring-primary/10",
							"overflow-hidden shadow-lg shadow-primary/10",
						)}
					>
						<Image
							alt={featured.name}
							className="object-contain p-1.5"
							fill
							priority
							sizes="80px"
							src={featured.spriteUrl}
						/>
					</div>
				</div>
			)}
		</div>
	);
}
