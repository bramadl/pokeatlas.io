import { trainerId } from "@pokepulse/core/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { format } from "date-fns";
import { redirect } from "next/navigation";

import { Container } from "@/components/ui/container";
import { getQueryClient } from "@/lib/tanstack/query/query-client";

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

const GUEST_MODE = false;

const TRAINER_ID = trainerId();

export default async function Dashboard() {
	if (GUEST_MODE) redirect("/");

	const queryClient = getQueryClient();
	void (await queryClient.prefetchQuery({
		...progressQueries.getSummary({ trainerId: TRAINER_ID }),
	}));

	const today = format(new Date(), "yyyy-MM-dd");
	void (await queryClient.prefetchQuery({
		...progressQueries.catchOfTheDay({ date: today, trainerId: TRAINER_ID }),
	}));

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<Container
				className="relative min-h-160 sm:my-8 flex flex-col gap-4 py-4 sm:py-0 md:px-4"
				padded
			>
				<div className="grid lg:grid-cols-[400px_1fr] gap-4">
					<TrainerCard trainerId={TRAINER_ID} />
					<SpeciesCompletion trainerId={TRAINER_ID} />
				</div>
				<CatchOfTheDay date={today} trainerId={TRAINER_ID} />
				<div className="grid lg:grid-cols-[1fr_360px] gap-4">
					<div className="flex flex-col gap-4">
						<TrackingCollections trainerId={TRAINER_ID} />
						<VariantCollections trainerId={TRAINER_ID} />
						<RegionalBreakdown trainerId={TRAINER_ID} />
					</div>
					<div className="flex flex-col gap-4">
						<CompletionAchievements />
						<CollectionInsights />
						<LatestAcquisition trainerId={TRAINER_ID} />
					</div>
				</div>
			</Container>
		</HydrationBoundary>
	);
}
