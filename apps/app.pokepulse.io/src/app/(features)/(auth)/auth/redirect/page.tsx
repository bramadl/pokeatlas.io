"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Commet } from "react-loading-indicators";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/client";

const FINALIZATION_DELAY = 1200;

type Step = "verifying" | "loading";

const STEP_COPY: Record<Step, string> = {
	loading: "Loading your workspace...",
	verifying: "Verifying your session...",
};

export default function AuthRedirectPage() {
	const router = useRouter();
	const [step, setStep] = useState<Step>("verifying");
	const [isError, setIsError] = useState(false);

	useEffect(() => {
		let cancelled = false;

		authClient
			.getSession()
			.then(async ({ data }) => {
				if (cancelled) return;

				if (!data?.session) {
					router.replace("/");
					return;
				}

				setStep("loading");
				await new Promise((r) => setTimeout(r, FINALIZATION_DELAY));

				if (!cancelled) router.replace("/dashboard");
			})
			.catch(() => {
				if (!cancelled) setIsError(true);
			});

		return () => {
			cancelled = true;
		};
	}, [router]);

	if (isError) {
		return (
			<main className="min-h-svh flex flex-col items-center justify-center gap-3">
				<p className="text-sm text-destructive">
					Something went wrong, please try to sign in again.
				</p>
				<Button asChild variant="link">
					<Link href="/">Go to Home</Link>
				</Button>
			</main>
		);
	}

	return (
		<main className="min-h-svh flex flex-col items-center justify-center gap-3">
			<Commet color="var(--primary)" size="large" text="" textColor="" />
			<p className="text-sm text-muted-foreground">{STEP_COPY[step]}</p>
		</main>
	);
}
