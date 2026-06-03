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

export const LANGUAGES = [
	{ emoji: "🇮🇩", label: "Bahasa Indonesia", value: "id" },
	{ emoji: "🇺🇸", label: "English", value: "en" },
	// { emoji: "🇯🇵", label: "日本語", value: "ja" },
] as const;

export const SETTINGS_ITEMS = [
	{ icon: KeyboardIcon, label: "Keyboard Shortcuts" },
	{ icon: WrenchIcon, label: "Tracking Preferences" },
] as const;

export const ACCOUNT_ITEMS = [
	{ icon: UserIcon, label: "Profile", shortcut: "⇧⌘P" },
] as const;

export const RESOURCE_ITEMS = [
	{ href: "/changelog", icon: ClockCounterClockwiseIcon, label: "Changelog" },
	{ href: "/roadmap", icon: MapTrifoldIcon, label: "Roadmap" },
	{
		href: "https://discord.gg/pokepulse",
		icon: DiscordLogoIcon,
		label: "Join Discord",
	},
] as const;

export const SUPPORT_ITEMS = [
	{ href: "/bug", icon: BugIcon, label: "Report a Bug" },
	{ href: "/feedback", icon: ChatCircleDotsIcon, label: "Feedback" },
	{
		href: "https://buymeacoffee.com/pokepulse",
		icon: CoffeeIcon,
		label: "Buy me a Coffee",
	},
] as const;
