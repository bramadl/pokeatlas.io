"use client";

import { ArrowsClockwiseIcon } from "@phosphor-icons/react";
import { useIsFetching, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useTrackingStore } from "./tracking/tracking.store";

interface RefreshButtonProps extends React.ComponentProps<typeof Button> {
	mobile?: boolean;
}

export function RefreshButton({
	className,
	mobile = true,
	...props
}: RefreshButtonProps) {
	const queryClient = useQueryClient();
	const hasInflight = useTrackingStore((s) => s.overlays.size > 0);

	const isFetching = useIsFetching({ queryKey: ["browse-pokedex"] }) > 0;
	const isDisabled = hasInflight || isFetching;

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
			size={mobile ? "icon" : "default"}
			variant="secondary"
			{...props}
		>
			<ArrowsClockwiseIcon className={cn(isFetching && "animate-spin")} />
			{mobile ? null : isFetching ? "Syncing..." : "Sync State"}
		</Button>
	);
}
