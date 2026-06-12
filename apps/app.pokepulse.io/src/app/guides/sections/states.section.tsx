import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Kbd } from "@/components/ui/kbd";
import { Separator } from "@/components/ui/separator";

import { SIGNATURE_EXAMPLES, TRACKING_STATES } from "../data";
import { Callout, SectionHeader } from "../ui";

export function StatesSection() {
	return (
		<section className="scroll-mt-8" id="tracking-states">
			<SectionHeader
				description="Every Pokémon in your collection can be tracked across multiple states — each representing a different form of ownership in Pokémon GO."
				eyebrow="Core Concept"
				title="Tracking States"
			/>

			<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
				{TRACKING_STATES.map(({ emoji, name, hotkey, desc }) => (
					<Card className="gap-3" key={name}>
						<CardHeader className="pb-0">
							<div className="flex items-center justify-between gap-2">
								<div className="flex items-center gap-2">
									<span className="text-xl">{emoji}</span>
									<CardTitle className="text-base">{name}</CardTitle>
								</div>
								<Kbd>{hotkey}</Kbd>
							</div>
						</CardHeader>
						<CardContent>
							<CardDescription>{desc}</CardDescription>
						</CardContent>
					</Card>
				))}
			</div>

			<Callout>
				<strong className="text-foreground">Tracking is additive.</strong> A
				single Pokémon can be marked as Base <em>and</em> Shiny <em>and</em>{" "}
				Lucky simultaneously — each state is tracked independently.
			</Callout>

			<Separator className="my-8" />

			<h3 className="text-base font-semibold tracking-tight mb-1">
				Signatures — Combining States
			</h3>
			<p className="text-muted-foreground text-sm mb-5">
				When you track multiple states on one Pokémon, the combination forms a{" "}
				<strong className="text-foreground">signature</strong> — stored
				internally as a{" "}
				<code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">
					+
				</code>
				-joined string.
			</p>

			<div className="flex flex-col gap-3">
				{SIGNATURE_EXAMPLES.map(({ states, sig, desc }) => (
					<div
						className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border border-border bg-card px-4 py-3"
						key={sig}
					>
						<div className="flex items-center gap-1.5 flex-wrap shrink-0">
							{states.map((s, i) => (
								<span className="flex items-center gap-1.5" key={s}>
									<Badge variant="secondary">{s}</Badge>
									{i < states.length - 1 && (
										<span className="text-muted-foreground text-xs">+</span>
									)}
								</span>
							))}
							<span className="text-muted-foreground text-xs mx-1">→</span>
							<code className="font-mono text-xs text-primary bg-accent/40 px-2 py-0.5 rounded-md">
								&quot;{sig}&quot;
							</code>
						</div>
						<p className="text-muted-foreground text-sm sm:border-l sm:border-border sm:pl-4">
							{desc}
						</p>
					</div>
				))}
			</div>

			<div className="mt-5">
				<Callout>
					<strong className="text-foreground">
						Not all combinations are valid.
					</strong>{" "}
					A Pokémon can&apos;t be both Shadow and Purified at the same time, or
					both Hundo and Nundo. PokéPulse enforces these mutual exclusions
					automatically.
				</Callout>
			</div>
		</section>
	);
}
