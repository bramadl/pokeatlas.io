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
		<Button
			className={cn(
				"fixed bottom-6 right-6 z-50 rounded-full shadow-lg",
				"transition-all duration-300 ease-out",
				visible
					? "opacity-100 translate-y-0 pointer-events-auto"
					: "opacity-0 translate-y-4 pointer-events-none",
			)}
			onClick={() => window.scrollTo({ behavior: "smooth", top: 0 })}
			size="icon"
			tabIndex={visible ? 1 : -1}
			variant="default"
		>
			<ArrowUpIcon />
		</Button>
	);
}
