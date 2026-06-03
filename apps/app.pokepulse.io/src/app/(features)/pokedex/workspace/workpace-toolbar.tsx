"use client";

import { PlusIcon } from "@phosphor-icons/react";
import { computeSignature, type TrackableState } from "@pokepulse/core";
import { Fragment, useState } from "react";

import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import { WorkspaceBrushes } from "./workspace-brushes";
import { WorkspaceMode } from "./workspace-mode";
import { WorkspaceRefreshButton } from "./workspace-refresh-button";

const pillClass = cn(
	"fixed bottom-4 sm:bottom-8 xl:bottom-4 z-50 w-fit items-center justify-center gap-2",
	"bg-background text-foreground drop-shadow-2xl border border-border/50 rounded-full px-2 py-1.5",
	"animate-in slide-in-from-bottom fade-in-0 fill-mode-both duration-500 ease-in-out",
);

interface WorkspaceToolbar {
	activateEraser: () => void;
	disableRefresh?: boolean;
	isEraserMode?: boolean;
	refreshWorkspace: () => void;
	setTrackingSignature: (signature: string) => void;
	trackingSignature: string;
	trackingStates: TrackableState[];
}

export function WorkspaceToolbar({
	activateEraser,
	disableRefresh,
	isEraserMode,
	refreshWorkspace,
	setTrackingSignature,
	trackingSignature,
	trackingStates,
}: WorkspaceToolbar) {
	const [isHidden, setIsHidden] = useState<boolean>(false);

	const signatureChangedHandler = (
		state: TrackableState,
		asState?: boolean,
	) => {
		if (isEraserMode) activateEraser();

		let nextSignature: string = state;
		if (!asState) nextSignature = computeSignature(trackingStates, state);
		setTrackingSignature(nextSignature);
	};

	return (
		<Fragment>
			<Popover modal>
				<aside className={cn(pillClass, "md:hidden flex gap-2 right-4")}>
					<WorkspaceRefreshButton
						disabled={disableRefresh}
						onRefreshed={refreshWorkspace}
						skipHotkey
					/>
					<PopoverTrigger asChild>
						<Button aria-label="Toggle brush toolbar" size="icon">
							<PlusIcon />
						</Button>
					</PopoverTrigger>
				</aside>
				<PopoverContent
					className={cn(
						"flex flex-col items-center gap-2 w-auto outline-none shadow-none ring-0",
						"bg-background drop-shadow-2xl border border-border/50 rounded-full p-1.5",
					)}
					sideOffset={16}
				>
					<WorkspaceBrushes
						isEraserMode={isEraserMode}
						onEraserActivated={activateEraser}
						onSignatureChanged={signatureChangedHandler}
						skipHotkeys
						trackingStates={trackingStates}
					/>
				</PopoverContent>
			</Popover>
			<aside
				className={cn(
					pillClass,
					"hidden md:flex left-1/2 -translate-x-1/2",
					isHidden && "-bottom-12!",
				)}
			>
				<WorkspaceMode
					isEraserMode={isEraserMode}
					isHidden={isHidden}
					onClicked={() => setIsHidden(!isHidden)}
					trackingSignature={trackingSignature}
				/>
				<WorkspaceBrushes
					isEraserMode={isEraserMode}
					onEraserActivated={activateEraser}
					onSignatureChanged={signatureChangedHandler}
					trackingStates={trackingStates}
					vertical={false}
				/>
				<Separator className="my-1" orientation="vertical" />
				<WorkspaceRefreshButton
					disabled={disableRefresh}
					onRefreshed={refreshWorkspace}
				/>
			</aside>
		</Fragment>
	);
}
