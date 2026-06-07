"use client";

import { ChartBarIcon } from "@phosphor-icons/react";
import { Fragment } from "react/jsx-runtime";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// TODO: Connect to real data — derive from ProgressSummary
// const INSIGHTS = [
//   { label: "Kanto is your most complete region", sub: "98% completed" },
//   { label: "Only 4 Temporary Evolutions remain", sub: "Closest collection to completion" },
//   { label: "Lucky Dex is your largest collection", sub: "522 entries tracked" },
//   { label: "Shadow Dex grew by 12 entries this month", sub: "Fastest growing collection" },
//   { label: "Female Variants are 10 away from completion", sub: "Closest variant category" },
// ];
const INSIGHTS: { label: string; sub: string }[] = [];

export function CollectionInsights() {
	return (
		<Card>
			{INSIGHTS.length === 0 ? (
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
			) : (
				<Fragment>
					<CardHeader>
						<CardTitle>Collection Insights</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{INSIGHTS.map((insight, index) => (
								<div key={insight.label}>
									{index !== 0 && <Separator />}
									<div>
										<p>{insight.label}</p>
										<p className="text-muted-foreground text-xs">
											{insight.sub}
										</p>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Fragment>
			)}
		</Card>
	);
}
