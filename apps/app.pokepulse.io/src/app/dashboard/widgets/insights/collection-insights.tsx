"use client";

import { ChartBarIcon } from "@phosphor-icons/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import { progressQueries } from "../../api/progress.query";
import { deriveInsights } from "./derive-insights";

interface CollectionInsightsProps {
	trainerId: string;
}

export function CollectionInsights({ trainerId }: CollectionInsightsProps) {
	const { data } = useSuspenseQuery({
		...progressQueries.getSummary({ trainerId }),
		select: (data) => data.summary,
	});

	const insights = useMemo(
		() => deriveInsights(data, trainerId),
		[data, trainerId],
	);

	if (insights.length === 0) {
		return (
			<Card>
				<CardContent>
					<div className="flex flex-col items-center gap-4 py-4 px-8 text-center text-muted-foreground">
						<div className="flex items-center justify-center size-16 rounded-full border bg-slate-50">
							<ChartBarIcon className="size-6" />
						</div>
						<div className="flex flex-col gap-1">
							<p className="font-medium text-xsm">No insights yet</p>
							<p className="text-xs">
								Patterns and highlights will appear as your collection grows.
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
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
