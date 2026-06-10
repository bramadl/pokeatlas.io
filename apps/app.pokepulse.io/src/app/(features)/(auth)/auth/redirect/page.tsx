"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Commet } from "react-loading-indicators";
import { authClient } from "@/lib/auth/client";

const STEPS = [
	"Setting up your trainer profile...",
	"Counting your Pokédex...",
	"Building regional data...",
	"Preparing tracking collections...",
	"Finalizing your workspace...",
] as const;

const STEP_INTERVAL = 1000;
const POLL_INTERVAL = 800;
const MIN_DURATION = 3200;
const MAX_DURATION = 60000;

export default function AuthRedirectPage() {
	const router = useRouter();
	const [stepIndex, setStepIndex] = useState(0);
	const [isError, setIsError] = useState(false);

	useEffect(() => {
		let cancelled = false;
		const startTime = Date.now();

		const stepTimer = setInterval(() => {
			setStepIndex((prev) => Math.min(prev + 1, STEPS.length - 1));
		}, STEP_INTERVAL);

		async function checkReady(): Promise<boolean> {
			try {
				const res = await fetch("/api/trainer/readiness");
				if (!res.ok) return false;
				const json = await res.json();
				console.log("[readiness]", json);
				return json.ready === true;
			} catch {
				return false;
			}
		}

		async function poll() {
			const timeout = setTimeout(() => {
				if (!cancelled) {
					clearInterval(stepTimer);
					setIsError(true);
				}
			}, MAX_DURATION);

			while (!cancelled) {
				const ready = await checkReady();

				if (ready) {
					const elapsed = Date.now() - startTime;
					const remaining = Math.max(0, MIN_DURATION - elapsed);
					await new Promise((r) => setTimeout(r, remaining));

					if (!cancelled) {
						clearTimeout(timeout);
						clearInterval(stepTimer);
						router.replace("/dashboard");
					}
					return;
				}

				await new Promise((r) => setTimeout(r, POLL_INTERVAL));
			}

			clearTimeout(timeout);
		}

		authClient.getSession().then(({ data }) => {
			if (cancelled) return;

			if (!data?.session) {
				clearInterval(stepTimer);
				router.replace("/");
				return;
			}

			poll();
		});

		return () => {
			cancelled = true;
			clearInterval(stepTimer);
		};
	}, [router]);

	if (isError) {
		return (
			<main className="min-h-svh flex flex-col items-center justify-center gap-3">
				<p className="text-sm text-destructive font-medium">
					Something went wrong, try refreshing.
				</p>
			</main>
		);
	}

	return (
		<main className="min-h-svh flex flex-col items-center justify-center gap-3">
			<Commet color="var(--primary)" size="large" text="" textColor="" />
			<p className="text-sm text-muted-foreground">{STEPS[stepIndex]}</p>
		</main>
	);
}
