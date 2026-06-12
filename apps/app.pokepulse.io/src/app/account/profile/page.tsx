import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { redirect } from "next/navigation";

import { getTrainer } from "@/app/(auth)/api/auth/auth.api";
import { progressQueries } from "@/app/dashboard/api/progress.query";
import { GlobalNavigation } from "@/components/global/navigation";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { getQueryClient } from "@/lib/tanstack/query/query-client";

import { BuddySection } from "./sections/buddy.section";
import { IdentitySection } from "./sections/identity.section";
import { TeamSection } from "./sections/team.section";
import { AchievementTimeline } from "./ui/achievement-timeline";
import { HighlightReels } from "./ui/highlight-reels";
import { MOCK_BUDDY_OPTIONS, MOCK_REEL_ENTRIES } from "./ui/mock.data";

export const dynamic = "force-dynamic";

export default async function AccountProfilePage() {
	const trainer = await getTrainer();
	if (!trainer) redirect("/");

	const {
		buddyPokemonRef: _,
		joinedAt,
		lastUpdatedAt,
		team,
		trainerId,
		user,
	} = trainer;

	const queryClient = getQueryClient();
	await queryClient.prefetchQuery(progressQueries.getSummary({ trainerId }));

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<div>
				<GlobalNavigation trainer={user} />
				<Container
					className="relative min-h-160 sm:my-8 flex flex-col gap-4 py-4 sm:py-0 md:px-4"
					padded
				>
					<div>
						<h1 className="text-xl font-bold">My Profile</h1>
						<p className="text-sm text-muted-foreground">
							Customize how you appear in PokéPulse.
						</p>
					</div>

					<IdentitySection
						email={user.email}
						image={user.image}
						joinedAt={joinedAt}
						lastUpdatedAt={lastUpdatedAt}
						name={user.name}
					/>

					{/* Buddy + Team */}
					<div className="grid lg:grid-cols-[360px_1fr] gap-4">
						<Card>
							<CardHeader>
								<CardTitle className="text-base">Buddy</CardTitle>
								<CardDescription>Your partner Pokémon.</CardDescription>
							</CardHeader>
							<CardContent>
								<BuddySection
									// currentBuddyRef={buddyPokemonRef}
									options={MOCK_BUDDY_OPTIONS}
									trainerId={trainerId}
								/>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className="text-base">Team</CardTitle>
								<CardDescription>
									Your Pokémon GO team — the side you fight for.
								</CardDescription>
							</CardHeader>
							<CardContent className="h-full">
								<TeamSection currentTeam={team} trainerId={trainerId} />
							</CardContent>
						</Card>
					</div>

					{/* Highlight Reels + Achievement Timeline */}
					<div className="grid lg:grid-cols-[1fr_400px] gap-4">
						<Card>
							<CardHeader>
								<CardTitle className="text-base">Highlight Reels</CardTitle>
								<CardDescription>
									A snapshot of your collection — randomly drawn from your
									tracked Pokémon.
								</CardDescription>
							</CardHeader>
							<CardContent className="h-full">
								<HighlightReels entries={MOCK_REEL_ENTRIES} />
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className="text-base">Achievements</CardTitle>
								<CardDescription>
									Your trainer journey, from first catch to legend.
								</CardDescription>
							</CardHeader>
							<CardContent>
								<AchievementTimeline trainerId={trainerId} />
							</CardContent>
						</Card>
					</div>
				</Container>
			</div>
		</HydrationBoundary>
	);
}
