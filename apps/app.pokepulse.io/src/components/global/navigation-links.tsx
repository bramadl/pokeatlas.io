"use client";

import { cn } from "@/lib/utils";

import { NAV_LINKS } from "./menu";
import { NavigationLink } from "./navigation-link";

interface NavigationLinksProps {
	mobile?: boolean;
	onLinkClicked?: () => void;
}

export function NavigationLinks({
	mobile = false,
	onLinkClicked,
}: NavigationLinksProps) {
	return (
		<div className={cn("flex items-center gap-3", mobile && "flex-col gap-1")}>
			{NAV_LINKS.map((link) => (
				<NavigationLink
					key={link.label}
					mobile={mobile}
					{...link}
					onLinkClicked={onLinkClicked}
				/>
			))}
		</div>
	);
}
