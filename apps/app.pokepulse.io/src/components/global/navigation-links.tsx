import { cn } from "@/lib/utils";
import { NavigationLink } from "./navigation-link";

const LINKS = [
	{ label: "Dashboard", url: "/dashboard" },
	{ label: "Pokédex", url: "/pokedex" },
	{ label: "Guides", url: "/guides" },
] as const;

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
			{LINKS.map((link) => (
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
