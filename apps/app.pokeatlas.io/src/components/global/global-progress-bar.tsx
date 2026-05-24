"use client";

import { ProgressProvider } from "@bprogress/next/app";

export function GlobalProgressBar({ children }: { children: React.ReactNode }) {
	return (
		<ProgressProvider
			color="var(--primary-foreground)"
			height="4px"
			options={{ showSpinner: true }}
			shallowRouting
		>
			{children}
		</ProgressProvider>
	);
}
