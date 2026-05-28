"use client";

import { GearIcon } from "@phosphor-icons/react";
import { useQueryState } from "nuqs";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

import { variantsParser } from "../filter.params";
import { VARIANT_CONTROL_OPTIONS } from "./variant.options";
import {
	getInitialVariants,
	VARIANT_DEFINITIONS,
	VARIANTS_BY_KEY,
	type VariantKey,
	writeStored,
} from "./variant.store";

export function VariantControls() {
	const [variants, setVariants] = useQueryState(
		"variants",
		variantsParser.withDefault(getInitialVariants()),
	);

	const variantSet = new Set(variants);
	const values = Object.fromEntries(
		VARIANT_DEFINITIONS.map((v) => [v.key, variantSet.has(v.urlValue)]),
	) as Record<VariantKey, boolean>;

	function toggle(key: VariantKey) {
		const { urlValue } = VARIANTS_BY_KEY[key];
		const next = !values[key];
		writeStored(key, next);
		setVariants(
			next
				? [...variantSet, urlValue]
				: [...variantSet].filter((v) => v !== urlValue),
		);
	}

	const activeCount = VARIANT_DEFINITIONS.filter((v) => values[v.key]).length;

	return (
		<Popover modal>
			<PopoverTrigger asChild>
				<Button
					className="hover:[&>svg]:rotate-90 relative"
					size="icon"
					variant="secondary"
				>
					<GearIcon className="transition-transform duration-300 ease-out origin-center" />
					{activeCount > 0 && (
						<span className="absolute top-0 right-0 flex items-center justify-center size-3 rounded-full text-[8px] font-bold bg-primary text-primary-foreground ring ring-primary ring-offset-1">
							{activeCount}
						</span>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent align="end" className="min-w-96" sideOffset={16}>
				<div className="flex flex-col gap-1">
					<p className="font-medium">Variant Controls</p>
					<p className="text-muted-foreground text-xs">
						Configure which Pokémon variants to show in your Pokédex.
					</p>
				</div>
				<div className="flex flex-col gap-3">
					{VARIANT_CONTROL_OPTIONS.map(({ key, label, description }) => (
						<label
							className="flex items-start gap-2 cursor-pointer group"
							htmlFor={key}
							key={key}
						>
							<Checkbox
								checked={values[key]}
								className="mt-0.5 shrink-0"
								id={key}
								onCheckedChange={() => toggle(key)}
							/>
							<div>
								<p className="text-sm font-medium leading-none group-hover:text-foreground transition-colors">
									{label}
								</p>
								<p className="text-xs text-muted-foreground mt-0.5">
									{description}
								</p>
							</div>
						</label>
					))}
				</div>
			</PopoverContent>
		</Popover>
	);
}
