"use client";

import { GearIcon, GlobeIcon, SignOutIcon } from "@phosphor-icons/react";

import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
	ACCOUNT_ITEMS,
	LANGUAGES,
	RESOURCE_ITEMS,
	SETTINGS_ITEMS,
	SUPPORT_ITEMS,
} from "./menu";

function AccountMenu() {
	return (
		<DropdownMenuGroup>
			<DropdownMenuLabel>Account</DropdownMenuLabel>
			{ACCOUNT_ITEMS.map(({ icon: Icon, label, shortcut }) => (
				<DropdownMenuItem key={label}>
					<Icon />
					{label}
					{shortcut && <DropdownMenuShortcut>{shortcut}</DropdownMenuShortcut>}
				</DropdownMenuItem>
			))}
			<DropdownMenuSub>
				<DropdownMenuSubTrigger>
					<GearIcon />
					Settings
				</DropdownMenuSubTrigger>
				<DropdownMenuPortal>
					<DropdownMenuSubContent>
						<DropdownMenuGroup>
							<DropdownMenuLabel>Preferences</DropdownMenuLabel>
							{SETTINGS_ITEMS.map(({ icon: Icon, label }) => (
								<DropdownMenuItem key={label}>
									<Icon />
									{label}
								</DropdownMenuItem>
							))}
							<DropdownMenuSub>
								<DropdownMenuSubTrigger>
									<GlobeIcon />
									Change Language
								</DropdownMenuSubTrigger>
								<DropdownMenuPortal>
									<DropdownMenuSubContent>
										<DropdownMenuGroup>
											<DropdownMenuLabel>Languages</DropdownMenuLabel>
											{LANGUAGES.map(({ emoji, label, value }) => (
												<DropdownMenuCheckboxItem key={value}>
													{emoji} {label}
												</DropdownMenuCheckboxItem>
											))}
										</DropdownMenuGroup>
									</DropdownMenuSubContent>
								</DropdownMenuPortal>
							</DropdownMenuSub>
						</DropdownMenuGroup>
					</DropdownMenuSubContent>
				</DropdownMenuPortal>
			</DropdownMenuSub>
		</DropdownMenuGroup>
	);
}

function ResourcesMenu() {
	return (
		<DropdownMenuGroup>
			<DropdownMenuLabel>Resources</DropdownMenuLabel>
			{RESOURCE_ITEMS.map(({ icon: Icon, label }) => (
				<DropdownMenuItem key={label}>
					<Icon />
					{label}
				</DropdownMenuItem>
			))}
		</DropdownMenuGroup>
	);
}

function SupportMenu() {
	return (
		<DropdownMenuGroup>
			<DropdownMenuLabel>Support</DropdownMenuLabel>
			{SUPPORT_ITEMS.map(({ icon: Icon, label }) => (
				<DropdownMenuItem key={label}>
					<Icon />
					{label}
				</DropdownMenuItem>
			))}
		</DropdownMenuGroup>
	);
}

export function TrainerDropdown() {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button className="flex items-center gap-2 hover:bg-foreground/25 hover:[&>svg]:rotate-180 focus-visible:bg-foreground/25">
					<span className="text-sm">Ash Ketchum</span>
					<Avatar className="ring ring-primary-foreground" size="sm">
						<AvatarImage alt="Ash Ketchum" src="/pp.jpeg" />
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<AccountMenu />
				<DropdownMenuSeparator />
				<ResourcesMenu />
				<DropdownMenuSeparator />
				<SupportMenu />
				<DropdownMenuSeparator />
				<DropdownMenuItem variant="destructive">
					<SignOutIcon />
					Sign Out
					<DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
