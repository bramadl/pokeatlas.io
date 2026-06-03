import { NavigationLink } from "./navigation-link";

const LINKS = [
	{ label: "Dashboard", url: "/" },
	{ label: "Pokédex", url: "/pokedex" },
	{ label: "Guides", url: "/guides" },
] as const;

export function NavigationLinks() {
	return (
		<div className="flex items-center gap-3">
			{LINKS.map((link) => (
				<NavigationLink key={link.label} {...link} />
			))}
		</div>
	);
}
