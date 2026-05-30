import { useProgress } from "@bprogress/next";
import { useEffect } from "react";
import { useIsClient, useIsMounted } from "usehooks-ts";

interface UsePokedexProgressBarOptions {
	/**
	 * @description
	 * Controls when does the progress bar should run.
	 */
	show: { when: boolean };
}

/**
 * @description
 * A hook that automatically shows progress bar for the given condition.
 */
export function usePokedexProgressBar({
	show: { when },
}: UsePokedexProgressBarOptions) {
	const progress = useProgress();

	const isClient = useIsClient();
	const isMounted = useIsMounted();

	useEffect(() => {
		if (!isClient || !isMounted()) return;
		if (when) progress.start(0, 0, true);
		else progress.stop();
	}, [when, isClient, isMounted, progress]);
}
