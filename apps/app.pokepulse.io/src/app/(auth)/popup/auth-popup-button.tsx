"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useAuthPopup } from "./use-auth-popup";

export function AuthPopupButton({
	className,
	children,
	onClick,
	...props
}: React.ComponentProps<typeof Button>) {
	const { open } = useAuthPopup();
	return (
		<Button className={cn(className)} onClick={open} {...props}>
			{children || "Get Started"}
		</Button>
	);
}
