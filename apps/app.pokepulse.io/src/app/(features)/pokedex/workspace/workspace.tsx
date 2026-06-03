"use client";

import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import { Container } from "@/components/ui/container";
import { ScrollToTop } from "@/components/ui/scroll-to-top";

import { pokedexQueryKeys } from "../pokedex.query";
import { usePokedexStore } from "../use-pokedex-store";
import { useTrackingStates } from "./tracking/use-tracking-states";
import { WorkspaceToolbar } from "./workpace-toolbar";

export function Workspace({ children }: React.PropsWithChildren) {
	const queryClient = useQueryClient();
	const isFetching = useIsFetching({ queryKey: pokedexQueryKeys.all() }) > 0;

	const defaultSignature = usePokedexStore((s) => s.defaultSignature);
	const trackingSignature = usePokedexStore((s) => s.trackingSignature);
	const setTrackingSignature = usePokedexStore((s) => s.setTrackingSignature);

	const isEraserActive = usePokedexStore((s) => s.isEraserActive);
	const setIsEraserActive = usePokedexStore((s) => s.setIsEraserActive);

	const activateEraser = () => {
		if (isEraserActive) setTrackingSignature(defaultSignature);
		setIsEraserActive(!isEraserActive);
	};

	const trackingStates = useTrackingStates({ trackingSignature });
	const refreshWorkspace = () => {
		queryClient.invalidateQueries({
			queryKey: pokedexQueryKeys.all(),
			refetchType: "active",
		});
	};

	return (
		<Container className="relative min-h-160 bg-slate-50 sm:my-8">
			<ScrollToTop />
			{children}
			<WorkspaceToolbar
				activateEraser={activateEraser}
				disableRefresh={isFetching}
				isEraserMode={isEraserActive}
				refreshWorkspace={refreshWorkspace}
				setTrackingSignature={setTrackingSignature}
				trackingSignature={trackingSignature}
				trackingStates={trackingStates}
			/>
		</Container>
	);
}
