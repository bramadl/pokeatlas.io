"use client";

import { ArrowsClockwiseIcon } from "@phosphor-icons/react";
import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useTrackingStore } from "../../pokedex/tracking";

interface WorkspaceSyncButtonProps extends React.ComponentProps<typeof Button> {
	mobile?: boolean;
}

export function WorkspaceSyncButton({
	className,
	mobile = true,
	...props
}: WorkspaceSyncButtonProps) {
	const queryClient = useQueryClient();
	const hasInflight = useTrackingStore((s) => s.overlayedPokemonMap.size > 0);

	const isFetching = useIsFetching({ queryKey: ["browse-pokedex"] }) > 0;
	const isDisabled = hasInflight || isFetching;

	const handleSync = useCallback(() => {
		queryClient.invalidateQueries({
			queryKey: ["browse-pokedex"],
			refetchType: "active",
		});
	}, [queryClient]);

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
			{mobile ? null : isFetching ? "Loading..." : "Refresh"}
		</Button>
	);
}
