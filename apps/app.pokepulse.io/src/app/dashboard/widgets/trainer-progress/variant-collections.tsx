"use client";

import { InfoIcon } from "@phosphor-icons/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Fragment } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

import { progressQueries } from "../../api/progress.query";

const VARIANT_META: Record<string, { label: string }> = {
	alternateForm: { label: "Alternate Forms" },
	costume: { label: "Costume Variants" },
	gender: { label: "Female Variants" },
	temporaryEvolution: { label: "Temporary Evolutions" },
};

const VARIANT_ORDER = [
	"alternateForm",
	"costume",
	"gender",
	"temporaryEvolution",
];

export function VariantCollections({ trainerId }: { trainerId: string }) {
	const { data } = useSuspenseQuery({
		...progressQueries.getSummary({ trainerId }),
		select: (data) => data.summary.variantCollections,
	});

	const variants = VARIANT_ORDER.flatMap((key) => {
		const stat = data[key as keyof typeof data];
		const meta = VARIANT_META[key];
		if (!stat || !meta) return [];
		return [{ ...meta, ...stat, key }];
	});

	return (
		<Card>
			<CardHeader>
				<CardTitle>
					Variant Collections
					<Tooltip>
						<TooltipTrigger aria-label="Info" className="align-middle ml-1">
							<InfoIcon />
						</TooltipTrigger>
						<TooltipContent>
							<div className="py-2 flex flex-col gap-2">
								<p>
									Only <strong>Base</strong> tracked state pokemons count.
								</p>
								<p>
									Such <em>Shiny</em>, <em>Hundo</em>, <em>Shadow</em>, etc–will
									not be counted.
								</p>
							</div>
						</TooltipContent>
					</Tooltip>
				</CardTitle>
				<CardDescription>Progress beyond species completion.</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				{variants.map((variant, index) => (
					<Fragment key={variant.key}>
						{index !== 0 && <Separator />}
						<dl className="flex items-center justify-between">
							<dt className="flex items-center">
								<p>{variant.label}</p>
							</dt>
							<dd className="flex items-center gap-4">
								<Progress
									className="w-12 lg:w-24 h-1"
									value={variant.completionPercentage}
								/>
								<p className="min-w-16 text-right text-xs text-muted-foreground font-semibold tracking-wider">
									{new Intl.NumberFormat().format(variant.tracked)} /{" "}
									{new Intl.NumberFormat().format(variant.total)}
								</p>
							</dd>
						</dl>
					</Fragment>
				))}
			</CardContent>
		</Card>
	);
}
