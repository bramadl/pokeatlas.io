"use client";

import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils";

import type { TypeTheme } from "../pokedex-theme";

// ── Helper components ─────────────────────────────────────────────────────────

function InformationTrigger({
	isHovered,
	name,
	onInfoClick,
	theme,
}: {
	isHovered: boolean;
	name: string;
	onInfoClick: () => void;
	theme: TypeTheme;
}) {
	return (
		<button
			aria-label={`Inspect ${name}`}
			className={cn(
				"absolute inset-0 z-20 rounded-full",
				"flex items-center justify-center outline-none",
				"transition-opacity duration-300",
				isHovered
					? "opacity-100 bg-black/15 backdrop-blur-[1px]"
					: "opacity-0 pointer-events-none",
			)}
			onClick={(e) => {
				e.stopPropagation();
				onInfoClick();
			}}
			tabIndex={-1}
			type="button"
		>
			<span
				className={cn(
					"size-6 rounded-full flex items-center justify-center",
					"text-xs font-semibold",
					"bg-white/90 shadow-md",
					theme.badgeText,
				)}
			>
				i
			</span>
		</button>
	);
}

function PokemonTypes({ types }: { types: string[] }) {
	return (
		<div className="flex items-center absolute left-1/2 bottom-1 -translate-x-1/2 translate-y-1/2">
			{types.map((t) => (
				<Image
					alt={t}
					className="object-contain"
					height={20}
					key={t}
					src={`/pokemon-types/${t.toLowerCase()}.png`}
					width={20}
				/>
			))}
		</div>
	);
}

// ── Component ─────────────────────────────────────────────────────────────────

interface PokedexCardSpriteProps {
	isTracked: boolean;
	name: string;
	onInfoClick: () => void;
	priority: boolean;
	spriteUrl: string;
	theme: TypeTheme;
	types: string[];
}

export function PokedexCardSprite({
	isTracked,
	name,
	onInfoClick,
	priority,
	spriteUrl,
	theme,
	types,
}: PokedexCardSpriteProps) {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<figure
			className={cn(
				"absolute z-3 top-0 -translate-y-1/2 left-1/2 -translate-x-1/2",
				"size-16 lg:size-20 rounded-full",
				"drop-shadow-md p-2",
				"group-hover:drop-shadow-2xl",
				"bg-linear-to-t to-white",
				"transition-all duration-300",
				theme.gradient,
				isTracked ? "drop-shadow-2xl" : "drop-shadow-black/5",
				isTracked && [theme.trackedBg],
			)}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<PokemonTypes types={types} />

			<div className="relative size-full overflow-hidden">
				<Image
					alt={name}
					className="object-contain p-1"
					fill
					priority={priority}
					sizes="64px"
					src={spriteUrl}
				/>
			</div>

			<InformationTrigger
				isHovered={isHovered}
				name={name}
				onInfoClick={onInfoClick}
				theme={theme}
			/>
		</figure>
	);
}
