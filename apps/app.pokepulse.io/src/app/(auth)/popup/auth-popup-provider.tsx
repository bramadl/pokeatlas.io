"use client";

import { useCallback, useState } from "react";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

import { AuthPopupContext } from "./auth-popup-context";
import { GoogleOAuth } from "./google-oauth";
import { MagicLink } from "./magic-link";

export function AuthPopupProvider({ children }: { children: React.ReactNode }) {
	const [isOpen, setIsOpen] = useState(false);

	const close = useCallback(() => setIsOpen(false), []);
	const open = useCallback(() => setIsOpen(true), []);

	return (
		<AuthPopupContext.Provider value={{ close, open }}>
			<Dialog onOpenChange={setIsOpen} open={isOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Welcome to PokePulse!</DialogTitle>
						<DialogDescription>
							Sign in to track your Pokémon GO collection.
						</DialogDescription>
					</DialogHeader>
					<GoogleOAuth />
					<div className="relative">
						<div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 px-4 bg-background">
							<p className="text-muted-foreground text-xs">or</p>
						</div>
						<Separator />
					</div>
					<MagicLink />
				</DialogContent>
			</Dialog>
			{children}
		</AuthPopupContext.Provider>
	);
}
