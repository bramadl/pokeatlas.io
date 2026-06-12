"use client";

import { useProgress, useRouter } from "@bprogress/next";
import {
	// GearIcon,
	// GlobeIcon,
	SignOutIcon,
} from "@phosphor-icons/react";
import Link from "next/link";

import { signOut } from "@/app/(auth)/api/auth/auth.api";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
	DropdownMenu,
	// DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	// DropdownMenuPortal,
	DropdownMenuSeparator,
	// DropdownMenuSub,
	// DropdownMenuSubContent,
	// DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
	ACCOUNT_ITEMS,
	// LANGUAGES,
	RESOURCE_ITEMS,
	// SETTINGS_ITEMS,
	SUPPORT_ITEMS,
} from "./menu";

function AccountMenu() {
	return (
		<DropdownMenuGroup>
			<DropdownMenuLabel>Account</DropdownMenuLabel>
			{ACCOUNT_ITEMS.map(({ icon: Icon, label, href }) => (
				<DropdownMenuItem asChild key={label}>
					<Link href={href}>
						<Icon />
						{label}
					</Link>
				</DropdownMenuItem>
			))}
			{/* <DropdownMenuSub>
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
			</DropdownMenuSub> */}
		</DropdownMenuGroup>
	);
}

function _ResourcesMenu() {
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

function _SupportMenu() {
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

function Logout() {
	const router = useRouter();
	const progress = useProgress();

	const signOutHandler = async () => {
		progress.start();
		await signOut().then(() => {
			router.replace("/");
		});
	};

	return (
		<DropdownMenuItem onClick={signOutHandler} variant="destructive">
			<SignOutIcon />
			Sign Out
		</DropdownMenuItem>
	);
}

interface TrainerDropdownProps {
	email: string;
	image?: string | null;
	name: string;
}

export function TrainerDropdown({ image, name }: TrainerDropdownProps) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button className="flex items-center gap-2 hover:bg-foreground/25 hover:[&>svg]:rotate-180 focus-visible:bg-foreground/25">
					<span className="text-sm">{name}</span>
					<Avatar className="ring ring-primary-foreground" size="sm">
						<AvatarImage alt={name} src={image ?? undefined} />
						<AvatarFallback>
							{name.split(" ").map((w) => (w[0] as string).toUpperCase())}
						</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<AccountMenu />
				{/* <DropdownMenuSeparator />
				<ResourcesMenu />
				<DropdownMenuSeparator />
				<SupportMenu /> */}
				<DropdownMenuSeparator />
				<Logout />
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
