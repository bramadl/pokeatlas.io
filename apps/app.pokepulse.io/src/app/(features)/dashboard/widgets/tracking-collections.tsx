"use client";

import { useRouter } from "@bprogress/next";
import { ArrowRightIcon } from "@phosphor-icons/react";
import {
	TRACKABLE_STATE_BRUSHES,
	TRACKING_SIGNATURE_CANONICAL_ORDER,
	type TrackableState,
} from "@pokepulse/core";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { progressQueries } from "../progress.query";

export function TrackingCollections({ trainerId }: { trainerId: string }) {
	const { data } = useSuspenseQuery({
		...progressQueries.getSummary({ trainerId }),
		select: (data) => data.summary.trackingCollections,
	});

	const collections = Object.entries(TRACKABLE_STATE_BRUSHES)
		.filter(([key]) => key !== "BASE" && key !== "ERASER")
		.sort(
			([a], [b]) =>
				TRACKING_SIGNATURE_CANONICAL_ORDER[a as TrackableState] -
				TRACKING_SIGNATURE_CANONICAL_ORDER[b as TrackableState],
		)
		.flatMap(([state, { emoji }]) => {
			const stat = data[state as keyof typeof data];
			if (!stat) return [];
			return [{ emoji, state, ...stat }];
		});

	const router = useRouter();
	const handleClick = (state: string) => {
		sessionStorage.setItem("pokedex:signature", state);
		router.push("/pokedex");
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Tracking Collections</CardTitle>
				<CardDescription>
					Collection progress across tracking states.
				</CardDescription>
			</CardHeader>
			<CardContent className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
				{collections.map((collection) => (
					<Card
						className="group relative transition-transform hover:scale-105 duration-300"
						key={collection.state}
					>
						<button
							aria-label="Open dex"
							className="absolute inset-0 z-2"
							onClick={() => handleClick(collection.state)}
							type="button"
						/>
						<CardHeader className="flex items-center justify-between">
							<CardTitle className="text-sm capitalize">
								<span className="mr-1">{collection.emoji}</span>{" "}
								<span>{collection.state.toLowerCase()} Dex</span>
							</CardTitle>
							<ArrowRightIcon
								className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all delay-100"
								size={12}
							/>
						</CardHeader>
						<CardContent>
							<div className="flex justify-between">
								<div>
									<div className="text-2xl font-bold">
										{new Intl.NumberFormat().format(collection.tracked)}
									</div>
									<div className="text-xs text-muted-foreground">
										of {new Intl.NumberFormat().format(collection.total)}
									</div>
								</div>
								<div className="text-sm font-medium">
									{collection.completionPercentage.toFixed(1)}%
								</div>
							</div>
						</CardContent>
						<CardFooter>
							<Progress
								className="h-1"
								value={collection.completionPercentage}
							/>
						</CardFooter>
					</Card>
				))}
			</CardContent>
		</Card>
	);
}
