import {
	BugIcon,
	ChatCircleDotsIcon,
	ClockCounterClockwiseIcon,
	CoffeeIcon,
	DiscordLogoIcon,
	KeyboardIcon,
	MapTrifoldIcon,
	UserIcon,
	WrenchIcon,
} from "@phosphor-icons/react";

export const NAV_LINKS = [
	{ href: "/dashboard", label: "Dashboard" },
	{ href: "/pokedex", label: "Pokédex" },
	{ href: "/guides", label: "Guides" },
] as const;

export const LANGUAGES = [
	{ emoji: "🇮🇩", label: "Bahasa Indonesia", value: "id" },
	{ emoji: "🇺🇸", label: "English", value: "en" },
] as const;

export const SETTINGS_ITEMS = [
	{ icon: KeyboardIcon, label: "Keyboard Shortcuts" },
	{ icon: WrenchIcon, label: "Tracking Preferences" },
] as const;

export const ACCOUNT_ITEMS = [
	{ href: "/account/profile", icon: UserIcon, label: "Profile" },
] as const;

export const RESOURCE_ITEMS = [
	{
		href: "/resources/changelog",
		icon: ClockCounterClockwiseIcon,
		label: "Changelog",
	},
	{ href: "/resources/roadmap", icon: MapTrifoldIcon, label: "Roadmap" },
	{
		href: "https://discord.gg/pokepulse",
		icon: DiscordLogoIcon,
		label: "Join Discord",
	},
] as const;

export const SUPPORT_ITEMS = [
	{ href: "/support/bug", icon: BugIcon, label: "Report a Bug" },
	{ href: "/support/feedback", icon: ChatCircleDotsIcon, label: "Feedback" },
	{
		href: "https://buymeacoffee.com/pokepulse",
		icon: CoffeeIcon,
		label: "Buy me a Coffee",
	},
] as const;
