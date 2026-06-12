"use client";

import { InfoIcon } from "@phosphor-icons/react";
import { useSuspenseQuery } from "@tanstack/react-query";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

import { progressQueries } from "../../api/progress.query";

export function SpeciesCompletion({ trainerId }: { trainerId: string }) {
	const { data } = useSuspenseQuery({
		...progressQueries.getSummary({ trainerId }),
		select: (data) => data.summary.speciesCompletion,
	});

	const tracked = new Intl.NumberFormat().format(data.tracked);
	const missing = new Intl.NumberFormat().format(data.total - data.tracked);
	const total = new Intl.NumberFormat().format(data.total);
	const completionPercentage = new Intl.NumberFormat("en-US", {
		maximumFractionDigits: 2,
		minimumFractionDigits: 2,
		style: "percent",
	}).format(data.completionPercentage / 100);

	return (
		<Card>
			<CardHeader>
				<CardTitle>
					Species Completion
					<Tooltip>
						<TooltipTrigger aria-label="Info" className="align-middle ml-1">
							<InfoIcon />
						</TooltipTrigger>
						<TooltipContent>
							<div className="py-2 flex flex-col gap-2">
								<p>
									Only <strong>Base tracked state</strong> and{" "}
									<strong>Base form</strong> pokemons count.
								</p>
								<p>
									Such <em>Alternate</em>, <em>Female</em>, <em>Costume</em>,{" "}
									<em>Shiny</em>, <em>Hundo</em>, <em>Shadow</em>, etc–will not
									be counted.
								</p>
								<p>
									<strong>Note:</strong> Some alternates that are in their
									default form is counted, for example:{" "}
									<strong>Aegislash (Shield Form)</strong>,{" "}
									<strong>Flabèbè (Yellow)</strong>,{" "}
									<strong>Zacian (Hero of Many Battles)</strong>, etc.
								</p>
							</div>
						</TooltipContent>
					</Tooltip>
				</CardTitle>
				<CardDescription>Your overall National Dex progress.</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col lg:flex-row lg:items-end gap-4 lg:gap-16">
				<div className="flex items-end gap-3 shrink-0">
					<div className="text-6xl font-bold">{tracked}</div>
					<div className="mb-1 text-muted-foreground">of {total} species</div>
				</div>
				<div className="flex-1 mb-2">
					<Field>
						<div className="flex items-end justify-between gap-4 text-muted-foreground text-xs">
							<FieldLabel className="text-muted-foreground text-xs font-normal">
								Completion
							</FieldLabel>
							<span>{completionPercentage}</span>
						</div>
						<Progress className="h-2" value={data.completionPercentage} />
					</Field>
				</div>
			</CardContent>
			<Separator />
			<CardFooter className="flex flex-col gap-2">
				<div className="w-full flex items-center justify-between gap-4">
					<div>
						<div className="text-xs text-muted-foreground">Tracked</div>
						<div className="font-semibold">{tracked} Species</div>
					</div>
					<div>
						<div className="text-xs text-muted-foreground">Missing</div>
						<div className="font-semibold">{missing} Species</div>
					</div>
					<div className="text-right">
						<div className="text-xs text-muted-foreground">
							Most Complete Region
						</div>
						<div className="font-semibold">
							<span className="capitalize">
								{data.mostCompleteRegion?.region.toLowerCase() ?? "–"}
							</span>{" "}
							{data.mostCompleteRegion && (
								<span>
									(
									{new Intl.NumberFormat("en-US", {
										maximumFractionDigits: 2,
										minimumFractionDigits: 2,
										style: "percent",
									}).format(data.mostCompleteRegion.completionPercentage / 100)}
									)
								</span>
							)}
						</div>
					</div>
				</div>
			</CardFooter>
		</Card>
	);
}
