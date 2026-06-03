"use client";

import { Separator } from "../ui/separator";
import { AppLogo } from "./app-logo";
import { SUPPORT_ITEMS } from "./menu";

export function FooterHeader() {
	return (
		<div className="self-stretch flex flex-col md:flex-row items-center justify-between gap-4">
			<AppLogo />
			<Separator className="bg-slate-800 md:hidden" />
			<small className="text-muted">
				Made with <span className="animate-pulse">❤️</span> for the community by{" "}
				<span className="text-primary font-medium">Bram Adl</span>
			</small>
			<Separator className="bg-slate-800 md:hidden" />
			<div className="flex items-center gap-1 md:gap-3">
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
	);
}
