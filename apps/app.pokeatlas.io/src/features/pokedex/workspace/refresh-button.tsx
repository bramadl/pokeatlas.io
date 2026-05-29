"use client";

import { ArrowsClockwiseIcon } from "@phosphor-icons/react";
import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import { useWindowSize } from "usehooks-ts";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTrackingStore } from "./tracking/tracking.store";

export function RefreshButton({
	className,
	...props
}: React.ComponentProps<typeof Button>) {
	const queryClient = useQueryClient();
	const hasInflight = useTrackingStore((s) => s.overlays.size > 0);
	const isFetching = useIsFetching({ queryKey: ["browse-pokedex"] }) > 0;

	const isDisabled = hasInflight || isFetching;
	const { width = 0 } = useWindowSize({ initializeWithValue: false });

	function handleSync() {
		queryClient.invalidateQueries({
			queryKey: ["browse-pokedex"],
			refetchType: "active",
		});
	}

	return (
		<Button
			className={cn("text-muted-foreground", className)}
			disabled={isDisabled}
			onClick={handleSync}
			size={width < 480 ? "icon" : "default"}
			variant="secondary"
			{...props}
		>
			<ArrowsClockwiseIcon className={cn(isFetching && "animate-spin")} />
			{width < 480 ? null : isFetching ? "Syncing..." : "Sync State"}
		</Button>
	);
}
