"use client";

import { HandPointingIcon } from "@phosphor-icons/react";
import { useCallback } from "react";

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
	type Brush,
	getDisabledBrushes,
	POINTER_META,
} from "./brush";

export function BrushToolbar() {
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

	return (
		<aside className="flex items-center justify-center gap-4">
			<Separator className="my-1 h-8" orientation="vertical" />

			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						aria-label="Pointer — track base"
						aria-pressed={isPointerMode}
						className={cn(
							"transition-colors",
							isPointerMode && "ring-2 ring-primary ring-offset-2",
						)}
						onClick={handlePointerClick}
						size="icon"
						variant={isPointerMode ? "default" : "secondary"}
					>
						<HandPointingIcon />
					</Button>
				</TooltipTrigger>
				<TooltipContent>{POINTER_META.label}</TooltipContent>
			</Tooltip>

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
								variant={isActive ? "destructive" : "secondary"}
							>
								<Icon />
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

			<Separator className="my-1 h-8" orientation="vertical" />

			<div className="flex items-center gap-2">
				{(
					["shiny", "hundo", "nundo", "shadow", "purified", "lucky"] as Brush[]
				).map((brush) => {
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
										isActive && "ring-2 ring-primary ring-offset-2",
										isDisabled &&
											"opacity-30 cursor-not-allowed pointer-events-none",
									)}
									disabled={isDisabled}
									onClick={() => handleBrushClick(brush)}
									size="icon"
									variant={isActive ? "default" : "secondary"}
								>
									<Icon />
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
		</aside>
	);
}
