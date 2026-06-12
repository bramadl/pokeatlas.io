import { DASHBOARD_WIDGETS } from "../data";
import { SectionHeader } from "../ui";

export function DashboardSection() {
	return (
		<section className="scroll-mt-8" id="dashboard">
			<SectionHeader
				description="A live snapshot of your collection progress. Every widget updates as you track."
				eyebrow="Your Progress HQ"
				title="Dashboard"
			/>

			<div className="flex flex-col gap-2">
				{DASHBOARD_WIDGETS.map(({ emoji, name, desc }) => (
					<div
						className="flex items-start gap-4 rounded-xl border border-border bg-card px-4 py-3"
						key={name}
					>
						<span className="text-2xl mt-0.5 shrink-0">{emoji}</span>
						<div>
							<p className="font-semibold text-sm mb-0.5">{name}</p>
							<p className="text-muted-foreground text-sm">{desc}</p>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
