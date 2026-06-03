"use client";

import { HandPointingIcon } from "@phosphor-icons/react";
import {
	TRACKABLE_STATE_BRUSHES,
	TRACKING_SIGNATURE_CANONICAL_ORDER,
	type TrackableState,
} from "@pokepulse/core";
import { type RegisterableHotkey, useHotkeys } from "@tanstack/react-hotkeys";
import { Fragment } from "react/jsx-runtime";
import { useDebounceCallback } from "usehooks-ts";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface WorkspaceBrushesProps {
	isEraserMode?: boolean;
	onEraserActivated: () => void;
	onSignatureChanged: (state: TrackableState, asState?: boolean) => void;
	skipHotkeys?: boolean;
	trackingStates: TrackableState[];
	vertical?: boolean;
}

export function WorkspaceBrushes({
	isEraserMode,
	onEraserActivated,
	onSignatureChanged,
	skipHotkeys,
	trackingStates,
	vertical = true,
}: WorkspaceBrushesProps) {
	const debouncedSignatureChanged = useDebounceCallback(
		onSignatureChanged,
		300,
	);

	const orderedBrushes = Object.entries(TRACKABLE_STATE_BRUSHES)
		.filter(([key]) => key !== "BASE" && key !== "ERASER")
		.sort(
			([a], [b]) =>
				TRACKING_SIGNATURE_CANONICAL_ORDER[a as TrackableState] -
				TRACKING_SIGNATURE_CANONICAL_ORDER[b as TrackableState],
		);

	useHotkeys(
		[
			{
				callback: () => debouncedSignatureChanged("BASE"),
				hotkey: "Escape",
				options: { conflictBehavior: "replace" },
			},
			{
				callback: () => debouncedSignatureChanged("BASE"),
				hotkey: TRACKABLE_STATE_BRUSHES.BASE.hotkey as RegisterableHotkey,
			},
			...orderedBrushes.map(([key, { hotkey }]) => ({
				callback: () => debouncedSignatureChanged(key as TrackableState),
				hotkey: hotkey as RegisterableHotkey,
			})),
			...orderedBrushes.map(([key, { hotkey }]) => ({
				callback: () => debouncedSignatureChanged(key as TrackableState, true),
				hotkey: `Shift+${hotkey}` as RegisterableHotkey,
			})),
			{ callback: onEraserActivated, hotkey: "Backspace" },
		],
		{ enabled: !skipHotkeys },
	);

	return (
		<Fragment>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						className="transition-transform [&>svg]:transition-transform hover:scale-95 hover:[&>svg]:scale-110 hover:[&>svg]:rotate-45"
						onClick={() => onSignatureChanged("BASE")}
						size="icon"
						variant={
							isEraserMode
								? "secondary"
								: trackingStates.includes("BASE")
									? "default"
									: "secondary"
						}
					>
						<HandPointingIcon />
					</Button>
				</TooltipTrigger>
				<TooltipContent className="uppercase">
					BASE
					<kbd className="ml-2 text-[10px] opacity-60 font-mono">
						{TRACKABLE_STATE_BRUSHES.BASE.hotkey} | ESC
					</kbd>
				</TooltipContent>
			</Tooltip>

			<Separator
				className={cn(!vertical && "my-1")}
				orientation={!vertical ? "vertical" : "horizontal"}
			/>

			<div className={cn("flex gap-1", vertical && "flex-col")}>
				{orderedBrushes.map(([brush, { emoji, hotkey }]) => (
					<Tooltip key={brush}>
						<TooltipTrigger asChild>
							<Button
								className="transition-transform [&>svg]:transition-transform hover:scale-95 hover:[&>svg]:scale-110 hover:[&>svg]:rotate-45"
								onClick={() => onSignatureChanged(brush as TrackableState)}
								size="icon"
								variant={
									isEraserMode
										? "secondary"
										: trackingStates.includes(brush as TrackableState)
											? "default"
											: "secondary"
								}
							>
								{emoji}
							</Button>
						</TooltipTrigger>
						<TooltipContent className="uppercase">
							{brush}
							<kbd className="ml-2 text-[10px] opacity-60 font-mono">
								{hotkey}
							</kbd>
						</TooltipContent>
					</Tooltip>
				))}
			</div>

			<Separator
				className={cn(!vertical && "my-1")}
				orientation={!vertical ? "vertical" : "horizontal"}
			/>

			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						className="transition-transform [&>svg]:transition-transform hover:scale-95 hover:[&>svg]:scale-110 hover:[&>svg]:rotate-45"
						onClick={onEraserActivated}
						size="icon"
						variant={isEraserMode ? "default" : "secondary"}
					>
						{TRACKABLE_STATE_BRUSHES.ERASER.emoji}
					</Button>
				</TooltipTrigger>
				<TooltipContent className="uppercase">
					ERASER
					<kbd className="ml-2 text-[10px] opacity-60 font-mono">
						{TRACKABLE_STATE_BRUSHES.ERASER.hotkey}
					</kbd>
				</TooltipContent>
			</Tooltip>
		</Fragment>
	);
}
