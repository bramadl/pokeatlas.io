"use client";

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

const TRACKING_STATE_META: Record<string, { icon: string; label: string }> = {
	BASE: { icon: "⭐", label: "Base Dex" },
	HUNDO: { icon: "💯", label: "Hundo Dex" },
	LUCKY: { icon: "🍀", label: "Lucky Dex" },
	NUNDO: { icon: "🔴", label: "Nundo Dex" },
	PURIFIED: { icon: "💫", label: "Purified Dex" },
	SHADOW: { icon: "🌑", label: "Shadow Dex" },
	SHINY: { icon: "✨", label: "Shiny Dex" },
};

// Display order
const TRACKING_STATE_ORDER = [
	"SHINY",
	"SHADOW",
	"PURIFIED",
	"LUCKY",
	"HUNDO",
	"NUNDO",
];

export function TrackingCollections({ trainerId }: { trainerId: string }) {
	const { data } = useSuspenseQuery({
		...progressQueries.getSummary({ trainerId }),
		select: (data) => data.summary.trackingCollections,
	});

	const collections = TRACKING_STATE_ORDER.flatMap((state) => {
		const stat = data[state as keyof typeof data];
		const meta = TRACKING_STATE_META[state];
		if (!stat || !meta) return [];
		return [{ ...meta, ...stat, state }];
	});

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
					<Card key={collection.state}>
						<CardHeader>
							<CardTitle className="text-sm">
								{collection.icon} {collection.label}
							</CardTitle>
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
