"use client";

import { GearIcon } from "@phosphor-icons/react";
import { VARIANT_CONFIG } from "@pokeatlas/core";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

import { usePokedexFilter } from "./use-pokedex-filter";

export function VariantsControls() {
	const [{ variants }, setFilters] = usePokedexFilter();

	const activeVariantsCount = Object.values(variants).filter(Boolean).length;
	const toggleVariants = (variant: (typeof VARIANT_CONFIG)[number]) => {
		const nextVariants = {
			...variants,
			[variant.key]: !variants[variant.key],
		};

		const hasActiveVariants = Object.values(nextVariants).some(Boolean);
		setFilters((f) => ({
			...f,
			variants: hasActiveVariants ? nextVariants : null,
		}));
	};

	return (
		<Popover modal>
			<PopoverTrigger asChild>
				<Button
					className="hover:[&>svg]:rotate-90 relative"
					size="icon"
					variant="secondary"
				>
					<GearIcon className="transition-transform duration-300 ease-out origin-center" />
					{activeVariantsCount > 0 && (
						<span className="absolute top-0 right-0 flex items-center justify-center size-3 rounded-full text-[8px] font-bold bg-primary text-primary-foreground ring ring-primary ring-offset-1">
							{activeVariantsCount}
						</span>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent
				align="end"
				className="min-w-64 xl:min-w-96"
				sideOffset={16}
			>
				<div className="flex flex-col gap-1">
					<p className="font-bold xl:text-base leading-none">
						Variant Controls
					</p>
					<p className="text-muted-foreground text-xs">
						Configure which Pokémon variants to show in your Pokédex.
					</p>
				</div>
				<div className="flex flex-col gap-3">
					{VARIANT_CONFIG.map((variant) => (
						<Label
							className="flex items-start gap-2 cursor-pointer group"
							key={variant.key}
						>
							<Checkbox
								checked={variants[variant.key]}
								className="mt-0.5 shrink-0"
								onCheckedChange={() => toggleVariants(variant)}
							/>
							<div>
								<p className="text-sm font-medium leading-none group-hover:text-foreground transition-colors">
									{variant.label}
								</p>
								<p className="text-xs text-muted-foreground mt-1">
									{variant.description}
								</p>
							</div>
						</Label>
					))}
				</div>
			</PopoverContent>
		</Popover>
	);
}
