import { cn } from "@/lib/utils";

import type { TypeTheme } from "../pokedex-theme";

// ── Helper components ─────────────────────────────────────────────────────────

function BackgroundGradientOverlay({
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			className="absolute inset-px rounded-lg pointer-events-none overflow-hidden"
			{...props}
		>
			<div
				className={cn(
					"size-full bg-linear-to-b to-white",
					"origin-top transition-all duration-300 ease-in-out",
					className,
				)}
			/>
		</div>
	);
}

// ── Component ─────────────────────────────────────────────────────────────────

interface PokedexCardInfoProps {
	formBadge: string;
	formLabel: string;
	isBrushModeActive?: boolean;
	isTracked: boolean;
	name: string;
	theme: TypeTheme;
}

export function PokedexCardInfo({
	formBadge,
	formLabel,
	isTracked,
	name,
	theme,
}: PokedexCardInfoProps) {
	return (
		<div
			className={cn(
				"size-full text-center pt-10 flex flex-col",
				"bg-white rounded-lg shadow-2xl",
				"ring-2 ring-transparent",
				"border border-transparent",
			)}
		>
			<BackgroundGradientOverlay
				className={
					isTracked
						? cn(theme.trackedBg, "opacity-100", "scale-100")
						: cn(
								"opacity-0 group-hover:opacity-100",
								"scale-y-0 group-hover:scale-100",
								theme.hoverBg,
							)
				}
			/>

			<div className="flex-1 px-3 relative z-1 py-4">
				<span
					className={cn(
						"px-1.5 py-0.5 rounded-full font-mono text-[10px]",
						formBadge,
					)}
				>
					{formLabel}
				</span>
				<p
					className={cn(
						"text-xs text-muted-foreground mt-1 line-clamp-1",
						isTracked && theme.badgeText,
					)}
				>
					{name}
				</p>
			</div>
		</div>
	);
}
