import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { format } from "date-fns";
import { redirect } from "next/navigation";

import { GlobalNavigation } from "@/components/global/navigation";
import { Container } from "@/components/ui/container";
import { getQueryClient } from "@/lib/tanstack/query/query-client";

import { getTrainer } from "../(auth)/api/auth/auth.api";
import { progressQueries } from "./progress.query";
import { CatchOfTheDay } from "./widgets/catch-of-the-day";
import { CollectionInsights } from "./widgets/collection-insights";
import { CompletionAchievements } from "./widgets/completion-achievements";
import { LatestAcquisition } from "./widgets/latest-acquisition";
import { RegionalBreakdown } from "./widgets/regional-breakdown";
import { SpeciesCompletion } from "./widgets/species-completion";
import { TrackingCollections } from "./widgets/tracking-collections";
import { TrainerCard } from "./widgets/trainer-card";
import { VariantCollections } from "./widgets/variant-collections";

export default async function Dashboard() {
	const trainer = await getTrainer();
	if (!trainer) redirect("/");

	const {
		trainerId,
		user: { name, email, image },
	} = trainer;

	const queryClient = getQueryClient();
	const today = format(new Date(), "yyyy-MM-dd");

	await Promise.all([
		queryClient.prefetchQuery(progressQueries.getSummary({ trainerId })),
		queryClient.prefetchQuery(
			progressQueries.catchOfTheDay({ date: today, trainerId }),
		),
	]);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<GlobalNavigation trainer={trainer.user} />
			<Container
				className="relative min-h-160 sm:my-8 flex flex-col gap-4 py-4 sm:py-0 md:px-4"
				padded
			>
				<div className="grid lg:grid-cols-[400px_1fr] gap-4">
					<TrainerCard
						trainerEmail={email}
						trainerId={trainerId}
						trainerImage={image}
						trainerName={name}
					/>
					<SpeciesCompletion trainerId={trainerId} />
				</div>
				<CatchOfTheDay date={today} trainerId={trainerId} />
				<div className="grid lg:grid-cols-[1fr_360px] gap-4">
					<div className="flex flex-col gap-4">
						<TrackingCollections trainerId={trainerId} />
						<VariantCollections trainerId={trainerId} />
						<RegionalBreakdown trainerId={trainerId} />
					</div>
					<div className="flex flex-col gap-4">
						<CompletionAchievements trainerId={trainerId} />
						<CollectionInsights trainerId={trainerId} />
						<LatestAcquisition trainerId={trainerId} />
					</div>
				</div>
			</Container>
		</HydrationBoundary>
	);
}
