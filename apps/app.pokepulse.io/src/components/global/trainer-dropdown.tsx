"use client";

import {
	BugIcon,
	ChatCircleDotsIcon,
	ClockCounterClockwiseIcon,
	CoffeeIcon,
	DiscordLogoIcon,
	GearIcon,
	GlobeIcon,
	KeyboardIcon,
	MapTrifoldIcon,
	SignOutIcon,
	UserIcon,
	WrenchIcon,
} from "@phosphor-icons/react";

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

const LANGUAGES = [
	{ emoji: "🇮🇩", label: "Bahasa Indonesia", value: "id" },
	{ emoji: "🇺🇸", label: "English", value: "en" },
	// { emoji: "🇯🇵", label: "日本語", value: "ja" },
] as const;

const SETTINGS_ITEMS = [
	{ icon: KeyboardIcon, label: "Keyboard Shortcuts" },
	{ icon: WrenchIcon, label: "Tracking Preferences" },
] as const;

const ACCOUNT_ITEMS = [
	{ icon: UserIcon, label: "Profile", shortcut: "⇧⌘P" },
] as const;

const RESOURCE_ITEMS = [
	{ href: "/changelog", icon: ClockCounterClockwiseIcon, label: "Changelog" },
	{ href: "/roadmap", icon: MapTrifoldIcon, label: "Roadmap" },
	{
		href: "https://discord.gg/pokepulse",
		icon: DiscordLogoIcon,
		label: "Join Discord",
	},
] as const;

const SUPPORT_ITEMS = [
	{ href: "/bug", icon: BugIcon, label: "Report a Bug" },
	{ href: "/feedback", icon: ChatCircleDotsIcon, label: "Feedback" },
	{
		href: "https://buymeacoffee.com/pokepulse",
		icon: CoffeeIcon,
		label: "Buy me a Coffee",
	},
] as const;

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
