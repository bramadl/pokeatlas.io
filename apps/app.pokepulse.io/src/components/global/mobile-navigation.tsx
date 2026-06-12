"use client";

import { useProgress } from "@bprogress/next";
import { ListIcon, SignOutIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { signOut } from "@/app/(auth)/api/auth/auth.api";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
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

interface Menu {
	closeMenu: () => void;
}

function AppMenu({ closeMenu }: Menu) {
	return (
		<div>
			<Label className="text-xs text-muted-foreground mb-3">Menu</Label>
			<NavigationLinks mobile onLinkClicked={closeMenu} />
		</div>
	);
}

function AccountMenu({ closeMenu }: Menu) {
	return (
		<div>
			<Label className="text-xs text-muted-foreground mb-3">Account</Label>
			<div className="flex flex-col gap-1">
				{ACCOUNT_ITEMS.map(({ icon: Icon, label }) => (
					<Button
						className="justify-start"
						key={label}
						onClick={closeMenu}
						variant="ghost"
					>
						<Icon />
						{label}
					</Button>
				))}
			</div>
		</div>
	);
}

function _LanguageMenu({ closeMenu }: Menu) {
	return (
		<div>
			<Label className="text-xs text-muted-foreground mb-3">Language</Label>
			<div className="flex flex-col gap-1">
				{LANGUAGES.map(({ emoji, label }) => (
					<Button
						className="justify-start"
						key={label}
						onClick={closeMenu}
						variant="ghost"
					>
						<span className="mr-1">{emoji}</span>
						{label}
					</Button>
				))}
			</div>
		</div>
	);
}

function LogoutButton({ onLoggedOut }: { onLoggedOut: () => void }) {
	const router = useRouter();
	const progress = useProgress();

	const signOutHandler = async () => {
		progress.start();
		await signOut().then(() => {
			onLoggedOut();
			router.replace("/");
		});
	};

	return (
		<Button onClick={signOutHandler} variant="destructive">
			<SignOutIcon />
			Sign Out
		</Button>
	);
}

function MenuHeader() {
	return (
		<div className="py-2">
			<SheetTitle>
				<AppLogo to="/dashboard" />
			</SheetTitle>
			<SheetDescription className="sr-only">
				Track your Pokémon GO collection progress in one place.
			</SheetDescription>
		</div>
	);
}

function _ResourcesMenu({ closeMenu }: Menu) {
	return (
		<div>
			<Label className="text-xs text-muted-foreground mb-3">Resources</Label>
			<div className="flex flex-col gap-1">
				{RESOURCE_ITEMS.map(({ icon: Icon, label }) => (
					<Button
						className="justify-start"
						key={label}
						onClick={closeMenu}
						variant="ghost"
					>
						<Icon />
						{label}
					</Button>
				))}
			</div>
		</div>
	);
}

function _SettingsMenu({ closeMenu }: Menu) {
	return (
		<div>
			<Label className="text-xs text-muted-foreground mb-3">Settings</Label>
			<div className="flex flex-col gap-1">
				{SETTINGS_ITEMS.map(({ icon: Icon, label }) => (
					<Button
						className="justify-start"
						key={label}
						onClick={closeMenu}
						variant="ghost"
					>
						<Icon />
						{label}
					</Button>
				))}
			</div>
		</div>
	);
}

function _SupportMenu({ closeMenu }: Menu) {
	return (
		<div>
			<Label className="text-xs text-muted-foreground mb-3">Support</Label>
			<div className="flex flex-col gap-1">
				{SUPPORT_ITEMS.map(({ icon: Icon, label }) => (
					<Button
						className="justify-start"
						key={label}
						onClick={closeMenu}
						variant="ghost"
					>
						<Icon />
						{label}
					</Button>
				))}
			</div>
		</div>
	);
}

interface Trainer {
	email: string;
	image?: string | null;
	name: string;
}

function TrainerCard({ closeMenu, email, image, name }: Trainer & Menu) {
	return (
		<div className="flex flex-col gap-4 p-4 bg-slate-100 rounded">
			<div className="flex items-center gap-2">
				<Avatar className="ring ring-primary-foreground">
					<AvatarImage alt={name} src={image ?? undefined} />
					<AvatarFallback>
						{name.split(" ").map((w) => (w[0] as string).toUpperCase())}
					</AvatarFallback>
				</Avatar>
				<div className="flex flex-col gap-0">
					<span className="font-bold text-sm">{name}</span>
					<span className="text-xs text-muted-foreground">{email}</span>
				</div>
			</div>
			<Separator />
			<LogoutButton onLoggedOut={closeMenu} />
		</div>
	);
}

interface MobileNavigationProps extends Trainer {}

export function MobileNavigation({
	email,
	image,
	name,
}: MobileNavigationProps) {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const closeMenu = () => setIsOpen(false);

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
				<MenuHeader />
				<TrainerCard
					closeMenu={closeMenu}
					email={email}
					image={image}
					name={name}
				/>
				<Separator />
				<AppMenu closeMenu={closeMenu} />
				<Separator />
				<AccountMenu closeMenu={closeMenu} />
				{/* <Separator />
				<SettingsMenu closeMenu={closeMenu} />
				<Separator />
				<LanguageMenu closeMenu={closeMenu} />
				<Separator />
				<ResourcesMenu closeMenu={closeMenu} />
				<Separator />
				<SupportMenu closeMenu={closeMenu} /> */}
			</SheetContent>
		</Sheet>
	);
}
