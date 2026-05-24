import Image from "next/image";

import { cn } from "@/lib/utils";

import { getTypeTheme } from "./pokedex-theme";
import type { PokedexEntry } from "./types";

// ── Form badge ────────────────────────────────────────────────────────────────

const FORM_BADGE: Record<string, string> = {
	costume: "bg-yellow-100 text-yellow-800",
	female: "bg-violet-100 text-violet-800",
	mega: "bg-indigo-100 text-indigo-800",
	regional: "bg-cyan-100 text-cyan-800",
};

const FORM_LABEL: Record<string, string> = {
	costume: "Costume",
	female: "Female",
	mega: "Mega",
	regional: "Regional",
};

// ── State emojis ──────────────────────────────────────────────────────────────

const STATE_EMOJI: Record<string, string> = {
	BASE: "✓",
	HUNDO: "💯",
	LUCKY: "🍀",
	NUNDO: "0",
	PURIFIED: "🌀",
	SHADOW: "👾",
	SHINY: "✨",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function renderStateEmoji(state: string): string {
	return state
		.split("+")
		.map((s) => STATE_EMOJI[s] ?? s)
		.join("");
}

// ── Component ─────────────────────────────────────────────────────────────────

interface PokedexCardProps {
	/**
	 * When true, the card renders a dashed brush-mode hover ring to signal
	 * that tapping will paint a state, not track the entry itself.
	 */
	isBrushModeActive?: boolean;
	onTap?: () => void;
	pokemon: PokedexEntry;
	/** Pass true for cards that are above the fold (first ~12) to preload the sprite. */
	priority?: boolean;
}

export function PokedexCard({
	pokemon: p,
	onTap,
	priority = false,
	isBrushModeActive = false,
}: PokedexCardProps) {
	const isTracked = p.trackedStates.length > 0;
	const theme = getTypeTheme(p.types[0] as string);

	const formLabel = p.form
		? (FORM_LABEL[p.form] ?? p.form)
		: `#${String(p.dex).padStart(3, "0")}`;
	const formBadge = p.form
		? (FORM_BADGE[p.form] ?? "bg-slate-100 text-slate-800")
		: "bg-slate-100 text-slate-800";

	const visibleStates = p.trackedStates.slice(0, 2);
	const overflowCount = p.trackedStates.length - 2;

	return (
		<div className="relative mt-10 group hover:scale-105 has-[button:focus]:scale-105 transition-transform duration-500">
			{/* Tap overlay */}
			<button
				aria-label={isTracked ? `Untrack ${p.name}` : `Track ${p.name}`}
				className="absolute inset-0 z-10 rounded-lg cursor-pointer outline-none"
				onClick={onTap}
				type="button"
			/>

			{/* Card body */}
			<div
				className={cn(
					"size-full transition-opacity duration-300",
					isTracked ? "opacity-100" : "opacity-75",
				)}
			>
				{/* Sprite bubble */}
				<figure
					className={cn(
						"absolute z-1 top-0 -translate-y-1/2 left-1/2 -translate-x-1/2",
						"size-20 rounded-full bg-linear-to-t to-white shadow",
						"ring-1 transition-all duration-500 ease-out",
						theme.gradient,
						isTracked ? theme.trackedRing : "ring-transparent",
					)}
				>
					<div className="flex items-center absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2">
						{p.types.map((t) => (
							<Image
								alt={t}
								height={16}
								key={t}
								src={`/pokemon-types/${t.toLowerCase()}.png`}
								width={16}
							/>
						))}
					</div>
					<Image
						alt={p.name}
						className="object-contain p-1"
						fill
						priority={priority}
						sizes="80px"
						src={p.sprites.url}
					/>
				</figure>

				{/* Info card */}
				<div
					className={cn(
						"size-full text-center pt-10 flex flex-col",
						"rounded-lg bg-white shadow group-hover:shadow-lg group-has-[button:focus]:shadow-lg",
						"ring-1 transition-all duration-500",
						isTracked ? theme.trackedRing : "ring-transparent",
						// Brush mode: dashed primary ring on hover
						isBrushModeActive &&
							"group-hover:ring-2 group-hover:ring-primary/50 group-hover:ring-dashed",
					)}
				>
					{/* Background gradient overlay */}
					<div className="absolute inset-0 size-full rounded-lg overflow-hidden pointer-events-none">
						<div
							className={cn(
								"size-full bg-linear-to-b from-transparent to-white origin-top transition-all duration-1000 ease-out",
								isTracked
									? cn(theme.trackedBg)
									: cn(theme.hoverBg, "scale-y-0 group-hover:scale-y-100"),
							)}
						/>
					</div>

					{/* Brush mode hover overlay — tint to signal "you're painting" */}
					{isBrushModeActive && (
						<div className="absolute inset-0 rounded-lg bg-primary/0 group-hover:bg-primary/5 transition-colors duration-150 pointer-events-none" />
					)}

					{/* Text content */}
					<div className="flex-1 px-3 relative z-1 py-4">
						<span
							className={cn(
								"px-1.5 py-0.5 rounded-full font-mono text-[10px]",
								formBadge,
							)}
						>
							{formLabel}
						</span>
						<p className="text-xs text-muted-foreground mt-1 line-clamp-1">
							{p.name}
						</p>
					</div>
				</div>

				{/* Tracked state badges */}
				{p.trackedStates.length > 0 && (
					<div className="absolute left-0 -translate-x-1/2 inset-y-1 flex flex-col items-center justify-center gap-0.5">
						{visibleStates.map((state) => (
							<span
								className={cn(
									"flex items-center justify-center rounded-full text-[9px] font-semibold border shadow-sm animate-in fade-in-0 slide-in-from-left-[2px] duration-300",
									theme.badgeBg,
									theme.badgeBorder,
									theme.badgeText,
									renderStateEmoji(state).length > 1 ? "px-1" : "aspect-square",
								)}
								key={state}
							>
								{renderStateEmoji(state)}
							</span>
						))}
						{overflowCount > 0 && (
							<span
								className={cn(
									"size-4 inline-flex items-center justify-center rounded-full text-[9px] font-semibold border shadow-sm",
									theme.badgeBg,
									theme.badgeBorder,
									theme.badgeText,
								)}
							>
								+{overflowCount}
							</span>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
