"use client";

import { GoogleLogoIcon, SpinnerIcon } from "@phosphor-icons/react";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/client";

interface GoogleOAuthProps {
	disabled?: boolean;
}

export function GoogleOAuth({ disabled }: GoogleOAuthProps) {
	const [isPending, startTransition] = useTransition();

	function handleGoogleSignIn() {
		startTransition(async () => {
			await authClient.signIn.social({
				callbackURL: "/auth/redirect",
				newUserCallbackURL: "/auth/redirect",
				provider: "google",
			});
		});
	}

	return (
		<Button
			className="w-full gap-2"
			disabled={disabled || isPending}
			onClick={handleGoogleSignIn}
			type="button"
			variant="outline"
		>
			<GoogleLogoIcon weight="bold" />
			Continue with Google
			{isPending && <SpinnerIcon className="animate-spin" />}
		</Button>
	);
}
