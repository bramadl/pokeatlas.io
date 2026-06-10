"use client";

import { Button } from "@/components/ui/button";

import { useAuthPopup } from "./use-auth-popup";

export function AuthPopupButton() {
	const { open } = useAuthPopup();
	return (
		<Button
			className="bg-background text-primary hover:bg-background hover:text-primary"
			onClick={open}
		>
			Get Started
		</Button>
	);
}
