"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import { Button } from "../ui/button";

interface NavigationLinkProps {
	label: string;
	url: string;
}

export function NavigationLink({ label, url }: NavigationLinkProps) {
	const pathname = usePathname();

	return (
		<Button
			asChild
			className={cn(
				"hover:bg-foreground/25 focus-visible:bg-foreground/25",
				url === pathname &&
					"bg-foreground/25 hover:bg-foreground/25 focus-visible:bg-foreground/25",
			)}
			key={label}
		>
			<Link className="text-sm" href={url}>
				{label}
			</Link>
		</Button>
	);
}
