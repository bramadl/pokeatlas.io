import { COTD_FACTORS } from "../data";
import { Callout, SectionHeader } from "../ui";

export function CatchOfTheDaySection() {
	return (
		<section className="scroll-mt-8" id="cotd">
			<SectionHeader
				description="Every day, PokéPulse generates a curated list of 8 Pokémon worth chasing — personalized based on what you're missing and how close you are to completions."
				eyebrow="Daily Feature"
				title="Catch of the Day"
			/>

			<h3 className="text-base font-semibold tracking-tight mb-3">
				How It&apos;s Generated
			</h3>
			<p className="text-muted-foreground text-sm mb-5">
				The selection isn&apos;t random. Each slot uses a scoring pipeline that
				weighs Pokémon by how much catching them would move the needle for you:
			</p>

			<div className="flex flex-col gap-2 mb-6">
				{COTD_FACTORS.map(({ name, desc }) => (
					<div
						className="flex gap-3 items-start rounded-xl border border-border bg-card px-4 py-3"
						key={name}
					>
						<strong className="text-sm shrink-0 min-w-40">{name}</strong>
						<p className="text-muted-foreground text-sm">{desc}</p>
					</div>
				))}
			</div>

			<Callout>
				<strong className="text-foreground">Shiny slots are labeled.</strong>{" "}
				When a COTD entry targets a Shiny, it shows the Pokémon&apos;s shiny
				sprite instead of the standard one — so you know exactly what to look
				for.
			</Callout>

			<div className="mt-5">
				<Callout>
					<strong className="text-foreground">No manual refresh.</strong> The
					list resets at midnight. The whole point is a consistent daily target
					— not a reroll button.
				</Callout>
			</div>
		</section>
	);
}
