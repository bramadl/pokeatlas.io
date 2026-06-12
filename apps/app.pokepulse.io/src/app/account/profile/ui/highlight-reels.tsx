"use client";

import Image from "next/image";

import { cn } from "@/lib/utils";

export interface ReelEntry {
	id: string;
	name: string;
	spriteUrl: string;
}

interface HighlightReelsProps {
	entries: ReelEntry[];
}

// Positions for the "scattered" small sprites around the center
// Defined as [x%, y%] from center of the container, will be translated
const SCATTER_POSITIONS = [
	{ x: -38, y: -32 },
	{ x: 38, y: -32 },
	{ x: -52, y: 4 },
	{ x: 52, y: 4 },
	{ x: -28, y: 36 },
	{ x: 28, y: 36 },
	{ x: -10, y: -44 },
	{ x: 10, y: -44 },
	{ x: -46, y: -16 },
	{ x: 46, y: -16 },
	{ x: 0, y: 46 },
	{ x: -20, y: 26 },
];

function FloatingSprite({
	entry,
	style,
	size = "sm",
}: {
	entry: ReelEntry | null;
	style: React.CSSProperties;
	size?: "sm" | "xs";
}) {
	const dim = size === "sm" ? 44 : 32;

	return (
		<div
			className={cn(
				"absolute rounded-full border border-border/40 bg-muted/60 backdrop-blur-sm flex items-center justify-center overflow-hidden",
				"transition-transform hover:scale-110",
				entry ? "opacity-100" : "opacity-20 border-dashed",
			)}
			style={{
				height: dim,
				width: dim,
				...style,
			}}
			title={entry?.name}
		>
			{entry && (
				<Image
					alt={entry.name}
					className="object-contain p-0.5 drop-shadow-sm"
					fill
					sizes={`${dim}px`}
					src={entry.spriteUrl}
				/>
			)}
		</div>
	);
}

export function HighlightReels({ entries }: HighlightReelsProps) {
	const isEmpty = entries.length === 0;

	// First entry = the "star" in the center, rest = scattered
	const [featured, ...rest] = entries;

	const scattered = SCATTER_POSITIONS.map((pos, i) => ({
		entry: rest[i] ?? null,
		pos,
	}));

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
			className="relative mx-auto flex items-center justify-center"
			style={{ height: 260, width: "100%" }}
		>
			{/* Scattered small sprites */}
			{scattered.map(({ entry, pos }, i) => (
				<FloatingSprite
					entry={entry}
					key={entry?.id ?? `ghost-${i}`}
					size={i % 3 === 0 ? "sm" : "xs"}
					style={{
						left: `calc(50% + ${pos.x}%)`,
						top: `calc(50% + ${pos.y}%)`,
						transform: "translate(-50%, -50%)",
					}}
				/>
			))}

			{/* Center featured sprite — bigger, stands out */}
			{featured && (
				<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
					<div
						className={cn(
							"relative size-24 rounded-full",
							"border-2 border-primary/30 bg-primary/5",
							"ring-4 ring-primary/10",
							"flex items-center justify-center overflow-hidden",
							"shadow-lg",
						)}
					>
						<Image
							alt={featured.name}
							className="object-contain p-2 drop-shadow-md"
							fill
							priority
							sizes="96px"
							src={featured.spriteUrl}
						/>
					</div>
					<p className="mt-2 text-center text-xs font-medium capitalize text-muted-foreground">
						{featured.name}
					</p>
				</div>
			)}
		</div>
	);
}
