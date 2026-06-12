"use client";

import { SpinnerIcon } from "@phosphor-icons/react";
import { Fragment, useRef, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/client";

import { grantAuthAccess } from "../api/auth/auth.api";

interface MagicLinkProps {
	disabled?: boolean;
}

export function MagicLink({ disabled }: MagicLinkProps) {
	const [email, setEmail] = useState("");
	const [sent, setSent] = useState(false);
	const [error, setError] = useState("");
	const [isPending, startTransition] = useTransition();
	const inputRef = useRef<HTMLInputElement>(null);

	function handleSend() {
		const trimmed = email.trim();
		if (!trimmed) {
			inputRef.current?.focus();
			return;
		}

		startTransition(async () => {
			setError("");

			await grantAuthAccess();
			const { data, error: err } = await authClient.signIn.magicLink({
				callbackURL: "/auth/redirect",
				email: trimmed,
				newUserCallbackURL: "/auth/provision",
			});

			if (err) {
				setError(err.message ?? "Something went wrong. Try again.");
				return;
			}

			if (data.status === true) setSent(true);
		});
	}

	if (sent) {
		return (
			<div className="flex flex-col gap-2 py-2 text-center">
				<p className="text-2xl">📬</p>
				<p className="font-medium text-sm">Check your inbox</p>
				<p className="text-xs text-muted-foreground">
					We sent a magic link to{" "}
					<span className="font-medium text-foreground">{email}</span>.
				</p>
				<Button
					className="mt-1"
					onClick={() => {
						setSent(false);
						setEmail("");
					}}
					size="sm"
					variant="ghost"
				>
					Use a different email
				</Button>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-4">
			<Field>
				<FieldLabel htmlFor="magic-email">Email address</FieldLabel>
				<Input
					autoComplete="email"
					disabled={disabled || isPending}
					id="magic-email"
					onChange={(e) => setEmail(e.target.value)}
					onKeyDown={(e) => e.key === "Enter" && handleSend()}
					placeholder="ash@pokemon.com"
					ref={inputRef}
					type="email"
					value={email}
				/>
				<FieldDescription className="text-xs">
					We'll send a magic link — no password needed.
				</FieldDescription>
			</Field>
			{error && <p className="text-xs text-destructive">{error}</p>}
			<Button
				className="w-full"
				disabled={disabled || isPending || !email.trim()}
				onClick={handleSend}
			>
				{isPending ? (
					<Fragment>
						<SpinnerIcon className="animate-spin" />
						Sending...
					</Fragment>
				) : (
					"Send Magic Link"
				)}
			</Button>
		</div>
	);
}
