"use client";

import { ListIcon, SignOutIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetTitle,
	SheetTrigger,
} from "../ui/sheet";
import { AppLogo } from "./app-logo";
import {
	ACCOUNT_ITEMS,
	LANGUAGES,
	RESOURCE_ITEMS,
	SETTINGS_ITEMS,
	SUPPORT_ITEMS,
} from "./menu";
import { NavigationLinks } from "./navigation-links";

export function MobileNavigation() {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	return (
		<Sheet onOpenChange={setIsOpen} open={isOpen}>
			<SheetTrigger asChild>
				<Button
					className="md:hidden hover:bg-foreground/25 focus-visible:bg-foreground/25"
					size="icon"
				>
					<ListIcon />
				</Button>
			</SheetTrigger>
			<SheetContent className="flex flex-col gap-4 p-4 overflow-y-auto overscroll-none">
				<div className="py-2">
					<SheetTitle>
						<AppLogo />
					</SheetTitle>
					<SheetDescription className="sr-only">
						Track your Pokémon GO collection progress in one place.
					</SheetDescription>
				</div>
				<div className="flex flex-col gap-4 p-4 bg-slate-100 rounded">
					<div className="flex items-center gap-2">
						<Avatar className="ring ring-primary-foreground" size="default">
							<AvatarImage alt="Ash Ketchum" src="/pp.jpeg" />
						</Avatar>
						<div className="flex flex-col gap-0">
							<span className="font-bold text-sm">Ash Ketchum</span>
							<span className="text-xs text-muted-foreground">
								ash@pokemon.com
							</span>
						</div>
					</div>
					<Separator />
					<Button variant="destructive">
						<SignOutIcon />
						Sign Out
					</Button>
				</div>
				<Separator />
				<div>
					<Label className="text-xs text-muted-foreground mb-3">Menu</Label>
					<NavigationLinks mobile onLinkClicked={() => setIsOpen(false)} />
				</div>
				<Separator />
				<div>
					<Label className="text-xs text-muted-foreground mb-3">Account</Label>
					<div className="flex flex-col gap-1">
						{ACCOUNT_ITEMS.map(({ icon: Icon, label }) => (
							<Button className="justify-start" key={label} variant="ghost">
								<Icon />
								{label}
							</Button>
						))}
					</div>
				</div>
				<Separator />
				<div>
					<Label className="text-xs text-muted-foreground mb-3">Settings</Label>
					<div className="flex flex-col gap-1">
						{SETTINGS_ITEMS.map(({ icon: Icon, label }) => (
							<Button className="justify-start" key={label} variant="ghost">
								<Icon />
								{label}
							</Button>
						))}
					</div>
				</div>
				<Separator />
				<div>
					<Label className="text-xs text-muted-foreground mb-3">Language</Label>
					<div className="flex flex-col gap-1">
						{LANGUAGES.map(({ emoji, label }) => (
							<Button className="justify-start" key={label} variant="ghost">
								<span className="mr-1">{emoji}</span>
								{label}
							</Button>
						))}
					</div>
				</div>
				<Separator />
				<div>
					<Label className="text-xs text-muted-foreground mb-3">
						Resources
					</Label>
					<div className="flex flex-col gap-1">
						{RESOURCE_ITEMS.map(({ icon: Icon, label }) => (
							<Button className="justify-start" key={label} variant="ghost">
								<Icon />
								{label}
							</Button>
						))}
					</div>
				</div>
				<Separator />
				<div>
					<Label className="text-xs text-muted-foreground mb-3">Support</Label>
					<div className="flex flex-col gap-1">
						{SUPPORT_ITEMS.map(({ icon: Icon, label }) => (
							<Button className="justify-start" key={label} variant="ghost">
								<Icon />
								{label}
							</Button>
						))}
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
