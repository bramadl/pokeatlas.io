"use client";

import { ArrowsClockwiseIcon, SpinnerGapIcon } from "@phosphor-icons/react";
import { useHotkey } from "@tanstack/react-hotkeys";

import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface WorkspaceRefreshButtonProps
	extends React.ComponentProps<typeof Button> {
	onRefreshed: () => void;
	skipHotkey?: boolean;
}

export function WorkspaceRefreshButton({
	className,
	disabled,
	onRefreshed,
	skipHotkey,
	...props
}: WorkspaceRefreshButtonProps) {
	useHotkey("R", onRefreshed, {
		conflictBehavior: "replace",
		enabled: !skipHotkey,
	});

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button
					className={cn(
						"group text-muted-foreground",
						"transition-transform [&>svg]:transition-transform hover:scale-95 hover:[&>svg]:scale-110 hover:[&>svg]:rotate-45",
						className,
					)}
					disabled={disabled}
					onClick={onRefreshed}
					size="icon"
					variant="secondary"
					{...props}
				>
					{disabled ? (
						<SpinnerGapIcon className="animate-spin" />
					) : (
						<ArrowsClockwiseIcon className="group-hover:rotate-90 transition-transform" />
					)}
				</Button>
			</TooltipTrigger>
			<TooltipContent>
				REFRESH
				<kbd className="ml-2 text-[10px] opacity-60 font-mono">R</kbd>
			</TooltipContent>
		</Tooltip>
	);
}
