import { cn } from "@/lib/utils";

import { parseSignature } from "./tracking/tracking-signature.utils";

interface WorkspaceModeProps {
	isEraserMode?: boolean;
	trackingSignature: string;
}

export function WorkspaceMode({
	isEraserMode,
	trackingSignature,
}: WorkspaceModeProps) {
	return (
		<div
			className={cn(
				"absolute bottom-full -translate-y-1/2 left-1/2 -translate-x-1/2 pointer-events-none bg-background text-foreground rounded-full px-2 py-1 text-xs shadow-sm whitespace-nowrap",
				!isEraserMode && "bg-destructive-foreground",
			)}
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
		</div>
	);
}
