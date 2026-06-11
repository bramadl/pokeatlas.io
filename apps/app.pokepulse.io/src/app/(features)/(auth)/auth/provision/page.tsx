"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Commet } from "react-loading-indicators";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/client";

import { checkReadiness, registerTrainer } from "../../api/auth/auth.api";

const POLL_INTERVAL = 800;
const MAX_DURATION = 60000;
const FINALIZE_DELAY = 1200;

type Step = "verifying" | "creating" | "provisioning" | "done";

const STEP_COPY: Record<Step, string> = {
	creating: "Creating your trainer account...",
	done: "You're all set, Trainer!",
	provisioning: "Building your Pokédex data...",
	verifying: "Verifying your session...",
};

export default function AuthProvisionPage() {
	const router = useRouter();
	const [step, setStep] = useState<Step>("verifying");
	const [isError, setIsError] = useState(false);

	useEffect(() => {
		let cancelled = false;

		async function provision() {
			const { data } = await authClient.getSession();
			if (cancelled) return;

			if (!data?.session) {
				router.replace("/");
				return;
			}

			setStep("creating");
			try {
				await registerTrainer(data.session.userId);
			} catch {
				if (!cancelled) setIsError(true);
				return;
			}
			if (cancelled) return;

			setStep("provisioning");
			const timeout = setTimeout(() => {
				if (!cancelled) {
					cancelled = true;
					setIsError(true);
				}
			}, MAX_DURATION);

			while (!cancelled) {
				let ready = false;
				try {
					ready = await checkReadiness();
				} catch {}
				if (cancelled) break;

				if (ready) {
					clearTimeout(timeout);
					setStep("done");
					await new Promise((r) => setTimeout(r, FINALIZE_DELAY));
					if (!cancelled) router.replace("/dashboard");
					return;
				}

				await new Promise((r) => setTimeout(r, POLL_INTERVAL));
			}

			clearTimeout(timeout);
		}

		provision();
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
