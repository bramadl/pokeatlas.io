import { Container } from "@/components/ui/container";

import { TableOfContent } from "../ui/table-of-content";

export function HeroSection() {
	return (
		<div className="border-b border-border">
			<Container className="py-16 sm:py-24" padded>
				<p className="font-mono text-[11px] uppercase tracking-widest text-primary mb-4">
					User Guide
				</p>
				<h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight mb-4">
					Track your collection.
					<br />
					<span className="text-primary">Your way.</span>
				</h1>
				<p className="text-muted-foreground text-base max-w-lg leading-relaxed mb-10">
					PokéPulse is a Pokémon GO collection tracker. This guide covers
					everything — tracking states, the Pokédex workspace, your Dashboard,
					and more.
				</p>
				<TableOfContent />
			</Container>
		</div>
	);
}
