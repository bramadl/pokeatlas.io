import { GlobalNavigation } from "@/components/global/navigation";

import { ArchetypesSection } from "./sections/archetypes.section";
import { CtaSection } from "./sections/cta.section";
import { DashboardMockupSection } from "./sections/dashboard-mockup.section";
import { FeaturesSection } from "./sections/features.section";
import { HeroSection } from "./sections/hero.section";
import { HowItWorksSection } from "./sections/how-it-works.section";
import { StatesSection } from "./sections/states.section";
import { StatsSection } from "./sections/stats.section";

export default function HomePage() {
	return (
		<div>
			<GlobalNavigation trainer={null} />
			<main className="min-h-screen bg-background text-foreground overflow-x-hidden">
				<HeroSection />
				<StatsSection />
				<StatesSection />
				<DashboardMockupSection />
				<FeaturesSection />
				<ArchetypesSection />
				<HowItWorksSection />
				<CtaSection />
			</main>
		</div>
	);
}