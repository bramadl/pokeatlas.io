"use client";

import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { Container } from "@/components/ui/container";
import { ScrollToTop } from "@/components/ui/scroll-to-top";

import { pokedexQueryKeys } from "../api/pokedex.query";
import { usePokedexStore } from "../store/use-pokedex-store";
import { WorkspaceToolbar } from "./workpace-toolbar";

interface WorkspaceProps extends React.PropsWithChildren {
	hideToolbar?: boolean;
}

export function Workspace({ children, hideToolbar }: WorkspaceProps) {
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

	const refreshWorkspace = () => {
		queryClient.invalidateQueries({
			queryKey: pokedexQueryKeys.all(),
			refetchType: "active",
		});
	};

	useEffect(() => {
		const pending = sessionStorage.getItem("pokedex:signature");
		if (!pending) return;
		sessionStorage.removeItem("pokedex:signature");
		setTrackingSignature(pending);
	}, [setTrackingSignature]);

	return (
		<Container className="relative min-h-[75svh] bg-slate-50 sm:my-8">
			<ScrollToTop />
			{children}
			{!hideToolbar && (
				<WorkspaceToolbar
					activateEraser={activateEraser}
					disableRefresh={isFetching}
					isEraserMode={isEraserActive}
					refreshWorkspace={refreshWorkspace}
					setTrackingSignature={setTrackingSignature}
					trackingSignature={trackingSignature}
				/>
			)}
		</Container>
	);
}
