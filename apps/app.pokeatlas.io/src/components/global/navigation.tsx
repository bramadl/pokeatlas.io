import Link from "next/link";

import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Separator } from "../ui/separator";

export function GlobalNavigation() {
	return (
		<header className="sticky top-0 h-16 bg-primary text-primary-foreground z-10">
			<div className="container mx-auto flex items-center justify-between h-full px-4 sm:px-0 lg:px-4 xl:px-0">
				<Link href="/">
					<span>
						Pokè<strong>Atlas</strong>
					</span>
					<span className="inline-flex items-center gap-2 ml-2 text-muted/80 text-xs">
						<span>|</span>
						<span>PokemonGO Progress Tracker</span>
					</span>
				</Link>

				<div className="hidden md:flex items-center gap-4">
					<div className="flex items-center gap-3">
						<Button
							asChild
							className="hover:bg-foreground/25 focus-visible:bg-foreground/25"
						>
							<Link className="text-sm" href="/">
								Dashboard
							</Link>
						</Button>
						<Button
							asChild
							className="bg-foreground/25 hover:bg-foreground/25 focus-visible:bg-foreground/25"
						>
							<Link className="text-sm" href="/pokedex">
								Pokèdex
							</Link>
						</Button>
					</div>

					<Separator className="my-2 opacity-30" orientation="vertical" />

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button className="flex items-center gap-2 hover:bg-foreground/25 hover:[&>svg]:rotate-180 focus-visible:bg-foreground/25">
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
