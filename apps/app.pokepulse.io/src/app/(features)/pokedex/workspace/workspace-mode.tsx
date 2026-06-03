import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import { parseSignature } from "./tracking/tracking-signature.utils";

interface WorkspaceModeProps {
	isEraserMode?: boolean;
	isHidden?: boolean;
	onClicked?: () => void;
	trackingSignature: string;
}

export function WorkspaceMode({
	isEraserMode,
	isHidden,
	onClicked,
	trackingSignature,
}: WorkspaceModeProps) {
	return (
		<Tooltip disableHoverableContent>
			<TooltipTrigger asChild>
				<button
					className={cn(
						"absolute bottom-full -translate-y-1/2 left-1/2 -translate-x-1/2 bg-background text-foreground rounded-full px-2 py-1 text-xs shadow-sm whitespace-nowrap",
						!isEraserMode && "bg-destructive-foreground",
					)}
					onClick={onClicked}
					type="button"
				>
					{!isEraserMode ? (
						<span>
							View Mode:{" "}
							<strong className="capitalize">
								{parseSignature(trackingSignature)}
							</strong>
						</span>
					) : (
						<strong className="text-destructive capitalize">
							ERASER MODE IS ACTIVE
						</strong>
					)}
				</button>
			</TooltipTrigger>
			<TooltipContent>
				Click to {isHidden ? "show" : "hide"} toolbar
			</TooltipContent>
		</Tooltip>
	);
}
