"use client";

import { ChartBarIcon } from "@phosphor-icons/react";
import { useSuspenseQuery } from "@tanstack/react-query";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import { progressQueries } from "../../api/progress.query";
import { EmptyWidget } from "../empty-widget";
import { deriveInsights } from "./derive-insights";

interface CollectionInsightsProps {
	trainerId: string;
}

export function CollectionInsights({ trainerId }: CollectionInsightsProps) {
	const { data } = useSuspenseQuery({
		...progressQueries.getSummary({ trainerId }),
		select: (data) => data.summary,
	});

	const insights = deriveInsights(data, trainerId);

	if (insights.length === 0) {
		return (
			<EmptyWidget
				description="Patterns and highlights will appear as your collection grows."
				Icon={ChartBarIcon}
				title="No insights yet"
			/>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Today's Insights</CardTitle>
				<CardDescription>
					A fresh look at your collection, updated daily.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{insights.map((insight) => (
						<Card key={insight.key}>
							<CardContent className="flex flex-col gap-0.5">
								<p className="text-sm font-medium leading-snug">
									{insight.label}
								</p>
								<p className="text-xs text-muted-foreground">{insight.sub}</p>
							</CardContent>
						</Card>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
