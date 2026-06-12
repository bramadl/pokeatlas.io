import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { POKEDEX_OPTIONS } from "../data";
import { SectionHeader } from "../ui";

export function PokedexSection() {
	return (
		<section className="scroll-mt-8" id="pokedex">
			<SectionHeader
				description="Your full browsable catalog of every trackable Pokémon. Filter, search, and mark — all in one place."
				eyebrow="Browse & Track"
				title="The Pokédex"
			/>

			<h3 className="text-base font-semibold tracking-tight mb-2">
				Choosing a Pokédex
			</h3>
			<p className="text-muted-foreground text-sm mb-4">
				Use the Dex Switcher in the toolbar — or press the arrow buttons to
				cycle through regions:
			</p>
			<div className="flex flex-wrap gap-2 mb-8">
				{POKEDEX_OPTIONS.map((opt, i) => (
					<span
						className={`font-mono text-xs px-3 py-1 rounded-full border ${
							i === 0
								? "bg-accent/40 border-primary text-primary"
								: "bg-card border-border text-muted-foreground"
						}`}
						key={opt}
					>
						{opt}
					</span>
				))}
			</div>

			<Separator className="my-8" />

			<h3 className="text-base font-semibold tracking-tight mb-3">
				Tracking Status Filter
			</h3>
			<div className="grid sm:grid-cols-3 gap-3 mb-8">
				{[
					{
						desc: "Every Pokémon, tracked or not.",
						label: "All",
					},
					{
						desc: "Only Pokémon you haven't tracked yet in the active view.",
						label: "Missing",
					},
					{
						desc: "Only Pokémon you've already marked in the active view.",
						label: "Tracked",
					},
				].map(({ label, desc }) => (
					<Card className="gap-2" key={label}>
						<CardHeader className="pb-0">
							<CardTitle className="text-sm">{label}</CardTitle>
						</CardHeader>
						<CardContent>
							<CardDescription className="text-xs">{desc}</CardDescription>
						</CardContent>
					</Card>
				))}
			</div>

			<h3 className="text-base font-semibold tracking-tight mb-3">
				Search Syntax
			</h3>
			<div className="flex flex-col gap-2 mb-8">
				{[
					{
						desc: "Multiple names at once, separated by commas.",
						example: "pikachu, eevee",
					},
					{
						desc: "Search by Pokédex number.",
						example: "25",
					},
					{
						desc: "Search by entire evolution family — matches Eevee and all Eeveelutions.",
						example: "+eevee",
					},
				].map(({ example, desc }) => (
					<div
						className="flex gap-3 items-center rounded-xl border border-border bg-card px-4 py-3"
						key={example}
					>
						<code className="font-mono text-xs text-primary bg-accent/40 px-2 py-0.5 rounded-md shrink-0">
							{example}
						</code>
						<p className="text-muted-foreground text-sm">{desc}</p>
					</div>
				))}
			</div>

			<h3 className="text-base font-semibold tracking-tight mb-2">
				Variant Controls
			</h3>
			<p className="text-muted-foreground text-sm">
				Alternate forms — costumes, regional variants, female forms, Mega
				evolutions — can be shown or hidden independently from the toolbar.
				Toggle them to keep your view focused.
			</p>
		</section>
	);
}
