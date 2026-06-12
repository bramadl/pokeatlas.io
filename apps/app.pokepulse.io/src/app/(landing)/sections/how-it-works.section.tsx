import { Container } from "@/components/ui/container";
import { Separator } from "@/components/ui/separator";

const HOW_IT_WORKS = [
	{
		desc: "Create your trainer account in seconds via Google or magic link. Your collection is private and tied to your account.",
		step: "01",
		title: "Sign in",
	},
	{
		desc: "Open the Pokédex, select a tracking state — Base, Shiny, Shadow, and more. Each state is tracked independently.",
		step: "02",
		title: "Pick a brush",
	},
	{
		desc: "Click Pokémon cards to toggle states. Combine states for signatures like HUNDO+SHINY. Use the eraser to undo. Keyboard shortcuts for speed.",
		step: "03",
		title: "Mark your catches",
	},
	{
		desc: "Your Dashboard updates in real time. Check Catch of the Day every morning. Unlock achievements as Dexes get completed.",
		step: "04",
		title: "Watch your stats grow",
	},
] as const;

export function HowItWorksSection() {
	return (
		<section className="border-b border-border">
			<Container padded className="py-20">
				<div className="flex flex-col items-center text-center mb-12 gap-3">
					<p className="font-mono text-[11px] uppercase tracking-widest text-primary">
						How it works
					</p>
					<h2 className="text-3xl font-bold tracking-tight">
						Up and running in minutes.
					</h2>
				</div>

				<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
					{HOW_IT_WORKS.map(({ step, title, desc }) => (
						<div
							key={step}
							className="flex flex-col gap-3 p-4 rounded-2xl transition-all duration-200 hover:bg-accent/30 group cursor-default"
						>
							<span className="font-mono text-4xl font-bold text-primary/30 leading-none transition-colors duration-200 group-hover:text-primary/60">
								{step}
							</span>
							<Separator className="w-8 transition-all duration-200 group-hover:w-12 group-hover:bg-primary" />
							<h3 className="font-semibold text-sm">{title}</h3>
							<p className="text-muted-foreground text-sm leading-relaxed">
								{desc}
							</p>
						</div>
					))}
				</div>
			</Container>
		</section>
	);
}