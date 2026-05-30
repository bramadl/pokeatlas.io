"use client";

import { HandPointingIcon } from "@phosphor-icons/react";
import { useCallback, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import { useWorkspace } from "../workspace.context";
import {
	applyBrushConstraints,
	BRUSH_META,
	BRUSH_ORDER,
	type Brush,
	getDisabledBrushes,
	HOTKEY_MAP,
	POINTER_META,
} from "./brush";

export function BrushToolbar({ vertical = false }: { vertical?: boolean }) {
	const { activeBrushes, activeView, setActiveBrushes } = useWorkspace();

	const disabledBrushes = getDisabledBrushes(activeView);
	const isPointerMode = activeBrushes.length === 0;

	const handlePointerClick = useCallback(() => {
		setActiveBrushes([]);
	}, [setActiveBrushes]);

	const handleBrushClick = useCallback(
		(brush: Brush) => {
			const isActive = activeBrushes.includes(brush);
			const next = isActive
				? activeBrushes.filter((b) => b !== brush)
				: [...activeBrushes, brush];

			setActiveBrushes(
				applyBrushConstraints(activeBrushes, next, disabledBrushes),
			);
		},
		[activeBrushes, disabledBrushes, setActiveBrushes],
	);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			const target = e.target as HTMLElement;
			if (
				target.isContentEditable ||
				target.tagName === "INPUT" ||
				target.tagName === "TEXTAREA" ||
				target.tagName === "SELECT"
			) {
				return;
			}

			if (e.ctrlKey || e.metaKey || e.altKey) return;

			const key = e.key.toLowerCase();
			if (key === "escape" || key === "b") {
				e.preventDefault();
				setActiveBrushes([]);
				return;
			}

			const brush = HOTKEY_MAP[key];
			if (!brush || disabledBrushes.has(brush)) return;

			e.preventDefault();
			handleBrushClick(brush);
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [disabledBrushes, handleBrushClick, setActiveBrushes]);

	return (
		<aside
			className={cn(
				"flex items-center justify-center gap-3",
				vertical && "flex-col",
			)}
		>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						aria-label="Pointer — track base"
						aria-pressed={isPointerMode}
						className={cn(
							"transition-colors",
							isPointerMode && "ring-2 ring-primary/50 ring-offset-1",
						)}
						onClick={handlePointerClick}
						size="icon"
						variant={isPointerMode ? "default" : "secondary"}
					>
						<HandPointingIcon />
					</Button>
				</TooltipTrigger>
				<TooltipContent>
					{POINTER_META.label}
					<kbd className="ml-2 text-[10px] opacity-60 font-mono">B</kbd>
				</TooltipContent>
			</Tooltip>

			<Separator
				className={vertical ? "mx-1 w-full" : "my-1"}
				orientation={vertical ? "horizontal" : "vertical"}
			/>

			<div className={cn("flex items-center gap-2", vertical && "flex-col")}>
				{(Object.keys(BRUSH_ORDER) as Brush[])
					.filter((b) => b !== "eraser")
					.sort((a, b) => BRUSH_ORDER[a] - BRUSH_ORDER[b])
					.map((brush) => {
						const meta = BRUSH_META[brush];
						const isActive = activeBrushes.includes(brush);
						const isDisabled = disabledBrushes.has(brush);
						const Icon = meta.icon;

						return (
							<Tooltip key={brush}>
								<TooltipTrigger asChild>
									<Button
										aria-disabled={isDisabled}
										aria-label={`${meta.label} brush`}
										aria-pressed={isActive}
										className={cn(
											"transition-colors",
											isActive && "ring-2 ring-primary/50 ring-offset-1",
											isDisabled &&
												"opacity-30 cursor-not-allowed pointer-events-none",
										)}
										disabled={isDisabled}
										onClick={() => handleBrushClick(brush)}
										size="icon"
										variant={isActive ? "default" : "secondary"}
									>
										{meta.text || <Icon />}
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<span>{meta.label}</span>
									<kbd className="ml-2 text-[10px] opacity-60 font-mono">
										{meta.hotkey}
									</kbd>
								</TooltipContent>
							</Tooltip>
						);
					})}
			</div>

			<Separator
				className={vertical ? "mx-1 w-full" : "my-1"}
				orientation={vertical ? "horizontal" : "vertical"}
			/>

			<Tooltip>
				<TooltipTrigger asChild>
					{(() => {
						const meta = BRUSH_META.eraser;
						const isActive = activeBrushes.includes("eraser");
						const Icon = meta.icon;
						return (
							<Button
								aria-label="Eraser — clear all tracked states"
								aria-pressed={isActive}
								className={cn(
									"transition-colors",
									isActive && "ring-2 ring-destructive ring-offset-2",
								)}
								onClick={() => handleBrushClick("eraser")}
								size="icon"
								variant={isActive ? "default" : "secondary"}
							>
								{meta.text || <Icon />}
							</Button>
						);
					})()}
				</TooltipTrigger>
				<TooltipContent>
					<span>{BRUSH_META.eraser.label}</span>
					<kbd className="ml-2 text-[10px] opacity-60 font-mono">
						{BRUSH_META.eraser.hotkey}
					</kbd>
				</TooltipContent>
			</Tooltip>
		</aside>
	);
}
