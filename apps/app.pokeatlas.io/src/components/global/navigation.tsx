import Link from "next/link";

import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuTrigger } from "../ui/dropdown-menu";

export function GlobalNavigation() {
	return (
		<header className="sticky top-0 h-16 bg-primary text-primary-foreground z-10">
			<div className="container mx-auto flex items-center justify-between h-full px-4 sm:px-0">
				<Link href="/">
					<h1 className="inline">
						Pokè<strong>Atlas</strong>
					</h1>
					<span className="inline-flex items-center gap-2 ml-2 text-muted/80 text-xs">
						<span>|</span>
						<span>PokemonGO Progress Tracker</span>
					</span>
				</Link>

				<div className="hidden md:flex items-center gap-4">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button className="flex items-center gap-2 hover:bg-red-950/5 hover:[&>svg]:rotate-180 focus-visible:bg-foreground/50">
								<span className="text-sm">Ash Ketchum</span>
								<Avatar className="ring ring-primary-foreground" size="sm">
									<AvatarImage alt="Ash Ketchum" src={"/pp.jpeg"} />
								</Avatar>
							</Button>
						</DropdownMenuTrigger>
					</DropdownMenu>
				</div>
			</div>
		</header>
	);
}
