"use client";

import { Container } from "../ui/container";
import { Separator } from "../ui/separator";
import { AppLogo } from "./app-logo";
import { SUPPORT_ITEMS } from "./menu";

export function GlobalFooter() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="bg-foreground dark:bg-sidebar text-background">
			<Container
				className="flex flex-col items-center md:items-start justify-center text-center md:text-left gap-4 py-8 md:min-h-40"
				padded
			>
				<div className="flex flex-col md:flex-row items-center md:items-start justify-center md:justify-between gap-4 md:self-stretch">
					<div className="flex flex-col items-start gap-4">
						<AppLogo />
						<small className="text-muted text-center">
							Made with <span className="animate-pulse">❤️</span> for the
							community by{" "}
							<span className="text-primary font-medium">Bram Adl</span>
						</small>
					</div>
					<div className="flex items-center gap-4">
						{[...SUPPORT_ITEMS].map(({ icon: Icon, label }) => (
							<button
								className="flex items-center gap-1 text-xs p-1 rounded bg-primary text-primary-foreground"
								key={label}
								type="button"
							>
								<Icon />
								{label}
							</button>
						))}
					</div>
				</div>
				<Separator className="bg-slate-800/50" />
				<div className="self-stretch flex flex-col md:flex-row-reverse md:justify-between gap-4">
					<small className="shrink-0 text-xs">
						&copy; {currentYear === 2026 ? currentYear : `2026–${currentYear}`}{" "}
						PokéPulse – All Rights Reserved
					</small>
					<strong className="font-normal text-xs text-muted text-center md:text-left italic opacity-75">
						PokéPulse is a companion app made for tracker purposes only and is
						not affiliated with the Pokemon brand, Niantic, Pokemon GO, or
						Nintendo.
					</strong>
				</div>
			</Container>
		</footer>
	);
}
