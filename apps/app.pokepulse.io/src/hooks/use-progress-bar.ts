import { useProgress } from "@bprogress/next";
import { useEffect } from "react";
import { useIsClient, useIsMounted } from "usehooks-ts";

interface UseProgressBarOptions {
	show: { when: boolean };
}

export function useProgressBar({
	show: { when: satisfied },
}: UseProgressBarOptions) {
	const progress = useProgress();

	const isClient = useIsClient();
	const isMounted = useIsMounted();

	useEffect(() => {
		if (!isClient || !isMounted()) return;
		if (satisfied) progress.start(0, 0, true);
		else progress.stop();
	}, [satisfied, isClient, isMounted, progress]);
}
