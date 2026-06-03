import { Container } from "../ui/container";
import { Separator } from "../ui/separator";
import { FooterHeader } from "./footer-header";

export function GlobalFooter() {
	return (
		<footer className="bg-foreground dark:bg-sidebar text-background">
			<Container
				className="flex flex-col items-center md:items-start justify-center text-center md:text-left gap-4 py-8 md:min-h-40"
				padded
			>
				<FooterHeader />
				<Separator className="bg-slate-800" />
				<div className="self-stretch flex flex-col md:flex-row-reverse md:items-center md:justify-between gap-4">
					<small>
						&copy; {new Date().getFullYear()} PokéPulse – All Rights Reserved
					</small>
					<strong className="font-normal text-xs text-muted text-center">
						PokéPulse is a companion app made for tracker purposes only and is
						not affiliated with the Pokemon brand, Niantic, Pokemon GO, or
						Nintendo.
					</strong>
				</div>
			</Container>
		</footer>
	);
}
