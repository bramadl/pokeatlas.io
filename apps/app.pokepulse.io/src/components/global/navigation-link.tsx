"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import { Button } from "../ui/button";

interface NavigationLinkProps {
	href: string;
	label: string;
	mobile?: boolean;
	onLinkClicked?: () => void;
}

export function NavigationLink({
	label,
	mobile,
	onLinkClicked,
	href,
}: NavigationLinkProps) {
	const pathname = usePathname();

	return (
		<Button
			asChild
			className={cn(
				mobile
					? "w-full justify-start"
					: cn(
							"hover:bg-foreground/25 focus-visible:bg-foreground/25",
							href === pathname &&
								"bg-foreground/25 hover:bg-foreground/25 focus-visible:bg-foreground/25",
						),
			)}
			key={label}
			onClick={onLinkClicked}
			variant={mobile ? (href === pathname ? "default" : "ghost") : "default"}
		>
			<Link className="text-sm" href={href}>
				{label}
			</Link>
		</Button>
	);
}
