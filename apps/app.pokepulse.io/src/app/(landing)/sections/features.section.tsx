import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Container } from "@/components/ui/container";

const FEATURES = [
	{
		desc: "Select a tracking state brush, click Pokémon cards to mark them. Full keyboard hotkey support — track entire runs without touching your mouse.",
		emoji: "🗂️",
		title: "Workspace & Brushes",
	},
	{
		desc: "Species completion, per-state Dex progress, regional breakdowns, variant collections, and latest acquisitions — all live, all in one view.",
		emoji: "📊",
		title: "Dashboard at a Glance",
	},
	{
		desc: "8 Pokémon selected daily by a scoring pipeline tuned to your collection gaps. Not random — ranked by what actually moves your progress.",
		emoji: "🌟",
		title: "Catch of the Day",
	},
	{
		desc: "Daily-rotating analysis of your tracker patterns. Surfaces your collector archetype, nearest completions, and best opportunities.",
		emoji: "💡",
		title: "Collection Insights",
	},
	{
		desc: "Switch between National, Kanto, Johto, and every region up to Paldea. Filter by type, classification, or tracking status. Search by name, number, or family.",
		emoji: "📖",
		title: "11 Regional Pokédexes",
	},
	{
		desc: "Complete a Shiny Dex. Finish a regional Dex. Collect every Shadow. Milestones are awarded automatically as your collection grows.",
		emoji: "🏆",
		title: "Achievements",
	},
] as const;

export function FeaturesSection() {
	return (
		<section className="border-b border-border">
			<Container className="py-20" padded>
				<div className="flex flex-col items-center text-center mb-12 gap-3">
					<p className="font-mono text-[11px] uppercase tracking-widest text-primary">
						Features
					</p>
					<h2 className="text-3xl font-bold tracking-tight">
						Everything a serious trainer needs.
					</h2>
				</div>

				<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{FEATURES.map(({ emoji, title, desc }) => (
						<Card
							className="gap-3 transition-all duration-200 hover:border-primary/50 hover:-translate-y-1 hover:shadow-md cursor-default group"
							key={title}
						>
							<CardHeader className="pb-0">
								<span className="text-2xl inline-block transition-transform duration-200 group-hover:scale-110 group-hover:rotate-3">
									{emoji}
								</span>
								<CardTitle className="text-sm">{title}</CardTitle>
							</CardHeader>
							<CardContent>
								<CardDescription className="text-sm leading-relaxed">
									{desc}
								</CardDescription>
							</CardContent>
						</Card>
					))}
				</div>
			</Container>
		</section>
	);
}
