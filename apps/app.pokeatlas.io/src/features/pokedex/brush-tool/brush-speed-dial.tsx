"use client";

import { PaintBrushIcon, XIcon } from "@phosphor-icons/react";
import { Kbd } from "@/components/ui/kbd";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { BRUSH_HOTKEY_LABEL, BRUSH_META, BRUSHES, type Brush } from "./brush";

interface BrushSpeedDialProps {
	activeBrushes: Brush[];
	highlightedIndex: number | null;
	isOpen: boolean;
	onBrushToggle: (brush: Brush) => void;
	onClearHighlight: () => void;
	onToggle: () => void;
}

export function BrushSpeedDial({
	isOpen,
	activeBrushes,
	highlightedIndex,
	onToggle,
	onBrushToggle,
	onClearHighlight,
}: BrushSpeedDialProps) {
	const hasActiveBrushes = activeBrushes.length > 0;
	const isEraserMode =
		activeBrushes.length === 1 && activeBrushes[0] === "eraser";

	return (
		<div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
			{isOpen && (
				<div className="flex flex-col items-end gap-2 md:p-1 pb-2 md:pb-3">
					{BRUSHES.map((brush, i) => {
						const Icon = BRUSH_META[brush].icon;

						const isActive = activeBrushes.includes(brush);
						const isHighlighted = highlightedIndex === i;

						const meta = BRUSH_META[brush];
						const hotkey = BRUSH_HOTKEY_LABEL[brush];
						const staggerIndex = BRUSHES.length - 0.25 - i;

						return (
							<div
								className={cn(
									"flex items-center gap-2",
									"transition-all duration-300",
									"animate-in slide-in-from-bottom-4 fade-in-0",
								)}
								key={brush}
								style={{
									transitionDelay: isOpen
										? `${staggerIndex * 40}ms`
										: `${(BRUSHES.length - 1 - staggerIndex) * 25}ms`,
								}}
							>
								<Tooltip delayDuration={500} disableHoverableContent>
									<TooltipTrigger
										aria-label={`${isActive ? "Deactivate" : "Activate"} ${meta.label} brush`}
										aria-pressed={isActive}
										className={cn(
											"size-10 rounded-full shadow-md flex items-center justify-center text-lg",
											"bg-primary-foreground text-primary active:scale-90",
											"transition-all duration-300",
											isActive
												? "bg-primary text-primary-foreground scale-110"
												: isHighlighted
													? "bg-accent scale-110 shadow-lg"
													: "bg-white text-foreground hover:bg-muted",
										)}
										onClick={() => {
											onBrushToggle(brush);
											onClearHighlight();
										}}
										tabIndex={-1}
										type="button"
									>
										<Icon className="size-4" weight="fill" />
									</TooltipTrigger>
									<TooltipContent side="left">
										{BRUSH_META[brush].label}
									</TooltipContent>
								</Tooltip>
							</div>
						);
					})}
				</div>
			)}

			{isOpen && (
				<button
					aria-label="Close brush dial"
					className="fixed inset-0 z-[-1] cursor-default bg-black/15 animate-in fade-in-0 transition-all duration-300"
					onClick={onToggle}
					tabIndex={-1}
					type="button"
				/>
			)}

			<button
				aria-expanded={isOpen}
				aria-label={isOpen ? "Close brush menu" : "Open brush menu"}
				className={cn(
					"relative size-10 md:size-12 rounded-full shadow-lg flex items-center justify-center",
					"hover:scale-105 active:scale-90",
					"transition duration-300",
					"outline-none ring-2 ring-transparent border border-transparent focus-visible:ring-ring/50 focus-visible:border-ring",
					!isOpen &&
						hasActiveBrushes && [
							isEraserMode
								? "ring-4 ring-destructive/30"
								: "ring-4 ring-primary/30",
							isEraserMode
								? "after:absolute after:inset-0 after:rounded-full after:ring-2 after:ring-destructive/20 after:animate-ping"
								: "after:absolute after:inset-0 after:rounded-full after:ring-2 after:ring-primary/20 after:animate-ping",
						],
					isOpen
						? "bg-primary/90 text-primary-foreground hover:bg-primary rotate-45 focus-visible:ring-primary/50 focus-visible:border-primary"
						: isEraserMode
							? "bg-destructive/90 hover:bg-destructive"
							: hasActiveBrushes
								? "bg-primary text-primary-foreground"
								: "bg-primary-foreground text-primary hover:bg-primary hover:text-primary-foreground",
				)}
				onClick={onToggle}
				type="button"
			>
				<span
					className={cn(
						"text-xl leading-none select-none",
						isOpen && "-rotate-45",
					)}
				>
					{!isOpen ? (
						hasActiveBrushes ? (
							activeBrushes.map((b) => {
								const Icon = BRUSH_META[b].icon;
								return <Icon className="size-4" key={b} />;
							})
						) : (
							<PaintBrushIcon className="size-4" weight="fill" />
						)
					) : (
						<XIcon className="size-4" />
					)}
				</span>
			</button>
		</div>
	);
}
