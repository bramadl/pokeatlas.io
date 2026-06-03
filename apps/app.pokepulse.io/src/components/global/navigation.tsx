import { Container } from "../ui/container";
import { Separator } from "../ui/separator";
import { AppLogo } from "./app-logo";
import { NavigationLinks } from "./navigation-links";
import { TrainerDropdown } from "./trainer-dropdown";

export function GlobalNavigation() {
	return (
		<header className="sticky top-0 h-16 bg-primary text-primary-foreground z-10">
			<Container className="flex items-center justify-between h-full" padded>
				<AppLogo />
				<div className="hidden md:flex items-center gap-4">
					<NavigationLinks />
					<Separator className="my-2 opacity-30" orientation="vertical" />
					<TrainerDropdown />
				</div>
			</Container>
		</header>
	);
}
