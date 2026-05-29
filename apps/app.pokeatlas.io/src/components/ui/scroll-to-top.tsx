"use client";

import { ArrowUpIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ScrollToTop() {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		function onScroll() {
			setVisible(window.scrollY > window.innerHeight);
		}

		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	return (
		<div
			className={cn(
				"fixed bottom-8 xl:bottom-4 right-1/2 translate-x-1/2 sm:translate-x-0 sm:right-6 z-50 p-2",
				"bg-background text-foreground drop-shadow-2xl border border-border/50 rounded-full",
				"transition-all duration-300 ease-out",
				visible
					? "opacity-100 translate-y-0 pointer-events-auto"
					: "opacity-0 translate-y-4 pointer-events-none",
			)}
		>
			<Button
				onClick={() => window.scrollTo({ behavior: "smooth", top: 0 })}
				size="icon"
				tabIndex={visible ? 1 : -1}
				variant="default"
			>
				<ArrowUpIcon />
			</Button>
		</div>
	);
}
