"use client";

import { cn } from "@/lib/utils";
import { activeBrushParts, type Brush } from "./brush";

interface BrushModeBannerProps {
	activeBrushes: Brush[];
	isBannerVisible: boolean;
	onClear: () => void;
}

export function BrushModeBanner({
	activeBrushes,
	isBannerVisible,
	onClear,
}: BrushModeBannerProps) {
	const parts = activeBrushParts(activeBrushes);

	const isEraser = activeBrushes.length === 1 && activeBrushes[0] === "eraser";

	return (
		<div
			className={cn(
				"fixed bottom-8 left-1/2 -translate-x-1/2 z-50",
				"flex flex-col items-center justify-center gap-1",
			)}
		>
			<div
				aria-live="polite"
				className={cn(
					"size-full flex justify-center",
					"transition-all duration-300 ease-out",
					isBannerVisible
						? "opacity-100 translate-y-0 pointer-events-auto h-10"
						: "opacity-0 -translate-y-2 pointer-events-none h-0 overflow-hidden",
				)}
			>
				{parts && (
					<div
						className={cn(
							"inline-flex items-center gap-2 px-4 py-1.5 rounded-full shadow-md",
							"text-sm font-medium ring-2",
							isEraser
								? "bg-destructive text-white ring-destructive/20"
								: "bg-primary text-primary-foreground ring-primary/20",
						)}
					>
						<span
							className={cn(
								"animate-pulse size-1.5 rounded-full",
								isEraser ? "bg-white/70" : "bg-primary-foreground/70",
							)}
						/>
						<span>{parts.emojis}</span>
						<span>{parts.names}</span>
						<span
							className={cn(
								"text-xs",
								isEraser ? "text-white/60" : "text-primary-foreground/60",
							)}
						>
							mode
						</span>
						<span className="opacity-50">|</span>
						<button
							className={cn(
								"text-xs transition-colors ease-out duration-300",
								isEraser
									? "text-white/60 hover:text-white"
									: "text-primary-foreground/60 hover:text-primary-foreground",
							)}
							onClick={onClear}
							type="button"
						>
							clear
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
