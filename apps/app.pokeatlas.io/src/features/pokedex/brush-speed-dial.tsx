"use client";

import { Kbd } from "@/components/ui/kbd";
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

	const fabEmoji = !isOpen
		? hasActiveBrushes
			? activeBrushes.map((b) => BRUSH_META[b].emoji).join("")
			: "🖌️"
		: "✕";

	return (
		<div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
			{/* Brush items */}
			<div className="flex flex-col items-end gap-3 overflow-hidden p-1 pb-3">
				{BRUSHES.map((brush, i) => {
					const isActive = activeBrushes.includes(brush);
					const isEraser = brush === "eraser";
					const isHighlighted = highlightedIndex === i;
					const meta = BRUSH_META[brush];
					const hotkey = BRUSH_HOTKEY_LABEL[brush];
					const staggerIndex = BRUSHES.length - 0.25 - i;

					return (
						<div
							className={cn(
								"flex items-center gap-2",
								"transition-all duration-500 ease-out",
								isOpen
									? "opacity-100 translate-y-0 pointer-events-auto"
									: "opacity-0 translate-y-4 pointer-events-none",
							)}
							key={brush}
							style={{
								transitionDelay: isOpen
									? `${staggerIndex * 40}ms`
									: `${(BRUSHES.length - 1 - staggerIndex) * 25}ms`,
							}}
						>
							{/* Label pill */}
							<span
								className={cn(
									"inline-flex items-center gap-1",
									"text-xs font-medium px-2.5 py-1 rounded-full shadow-sm",
									"transition-all duration-150",
									isActive
										? isEraser
											? "bg-destructive text-white"
											: "bg-primary text-primary-foreground"
										: isHighlighted
											? isEraser
												? "bg-destructive text-white"
												: "bg-accent text-background"
											: "bg-white text-muted-foreground",
									isHighlighted && "shadow-md",
								)}
							>
								<Kbd className="size-3 text-[9px]">⇧{hotkey}</Kbd>
								{meta.label}
							</span>

							{/* Brush button */}
							<button
								aria-label={`${isActive ? "Deactivate" : "Activate"} ${meta.label} brush`}
								aria-pressed={isActive}
								className={cn(
									"size-10 rounded-full shadow-md flex items-center justify-center text-lg",
									"transition-all duration-150 active:scale-90",
									"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
									isActive
										? isEraser
											? "bg-destructive text-white scale-110"
											: "bg-primary text-primary-foreground scale-110"
										: isHighlighted
											? isEraser
												? "bg-destructive text-white scale-110 shadow-lg"
												: "bg-accent text-background scale-110 shadow-lg"
											: "bg-white text-foreground hover:bg-muted",
								)}
								onClick={() => {
									onBrushToggle(brush);
									onClearHighlight();
								}}
								type="button"
							>
								{meta.emoji}
							</button>
						</div>
					);
				})}
			</div>

			{/* Backdrop — closes dial when clicking outside */}
			{isOpen && (
				<button
					aria-label="Close brush dial"
					className="fixed inset-0 z-[-1] cursor-default"
					onClick={onToggle}
					tabIndex={-1}
					type="button"
				/>
			)}

			{/* Main FAB */}
			<button
				aria-expanded={isOpen}
				aria-label={isOpen ? "Close brush menu" : "Open brush menu"}
				className={cn(
					"relative size-14 rounded-full shadow-lg flex items-center justify-center",
					"transition-all duration-200 active:scale-90",
					"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
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
						? "bg-primary/90 hover:bg-primary rotate-45"
						: isEraserMode
							? "bg-destructive"
							: hasActiveBrushes
								? "bg-primary"
								: "bg-white",
				)}
				onClick={onToggle}
				type="button"
			>
				<span
					className={cn(
						"text-background text-xl leading-none transition-all duration-500 delay-200 select-none",
						isOpen && "-rotate-45",
					)}
				>
					{fabEmoji}
				</span>
			</button>
		</div>
	);
}
