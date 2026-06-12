import { GlobalNavigation } from "@/components/global/navigation";
import { Container } from "@/components/ui/container";
import { Separator } from "@/components/ui/separator";

import { getTrainer } from "../(auth)/api/auth/auth.api";
import { CatchOfTheDaySection } from "./sections/catch-of-the-day.section";
import { DashboardSection } from "./sections/dashboard.section";
import { FaqSection } from "./sections/faq.section";
import { HeroSection } from "./sections/hero.section";
import { PokedexSection } from "./sections/pokedex.section";
import { StatesSection } from "./sections/states.section";
import { WorkspaceSection } from "./sections/workspace.section";

export default async function GuidesPage() {
	const trainer = await getTrainer();

	return (
		<main className="min-h-screen">
			<GlobalNavigation trainer={trainer?.user ?? null} />
			<HeroSection />
			<Container className="py-12 flex flex-col gap-16" padded>
				<StatesSection />
				<Separator />
				<WorkspaceSection />
				<Separator />
				<PokedexSection />
				<Separator />
				<DashboardSection />
				<Separator />
				<CatchOfTheDaySection />
				<Separator />
				<FaqSection />
			</Container>
		</main>
	);
}
