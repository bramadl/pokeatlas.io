import { Fragment } from "react/jsx-runtime";

import { AuthPopupButton } from "@/app/(auth)/popup/auth-popup-button";

import { Container } from "../ui/container";
import { Separator } from "../ui/separator";
import { AppLogo } from "./app-logo";
import { MobileNavigation } from "./mobile-navigation";
import { NavigationLinks } from "./navigation-links";
import { TrainerDropdown } from "./trainer-dropdown";

interface GlobalNavigationProps {
	trainer: {
		name: string;
		email: string;
		image?: string | null;
	} | null;
}

export async function GlobalNavigation({ trainer }: GlobalNavigationProps) {
	return (
		<header className="sticky top-0 h-16 bg-primary text-primary-foreground z-10">
			<Container className="flex items-center justify-between h-full" padded>
				<AppLogo />
				{trainer !== null ? (
					<Fragment>
						<div className="hidden md:flex items-center gap-2 lg:gap-4">
							<NavigationLinks />
							<Separator className="my-2 opacity-30" orientation="vertical" />
							<TrainerDropdown
								email={trainer.email}
								image={trainer.image}
								name={trainer.name}
							/>
						</div>
						<MobileNavigation
							email={trainer.email}
							image={trainer.image}
							name={trainer.name}
						/>
					</Fragment>
				) : (
					<AuthPopupButton className="bg-background text-primary hover:bg-background hover:text-primary" />
				)}
			</Container>
		</header>
	);
}
