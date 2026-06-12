"use client";

import { CaretUpDownIcon, CheckIcon } from "@phosphor-icons/react";
import Image from "next/image";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface BuddyOption {
	id: string;
	name: string;
	spriteUrl: string;
}

interface BuddySectionProps {
	buddy: BuddyOption | null;
	onBuddyChange: (buddy: BuddyOption | null) => void;
	options: BuddyOption[];
}

export function BuddySection({
	buddy,
	onBuddyChange,
	options,
}: BuddySectionProps) {
	const [open, setOpen] = useState(false);
	const [search, setSearch] = useState("");

	const filtered = useMemo(
		() =>
			options.filter((o) =>
				o.name.toLowerCase().includes(search.toLowerCase()),
			),
		[options, search],
	);

	const handleSelect = (id: string) => {
		const selected = options.find((o) => o.id === id) ?? null;
		// toggle off if same
		onBuddyChange(selected?.id === buddy?.id ? null : selected);
		setOpen(false);
	};

	return (
		<div className="flex flex-col gap-3">
			{buddy ? (
				<div className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/30 p-3">
					<div className="relative size-14 shrink-0 rounded-full bg-muted flex items-center justify-center overflow-hidden">
						<Image
							alt={buddy.name}
							className="object-contain drop-shadow-sm"
							fill
							sizes="56px"
							src={buddy.spriteUrl}
						/>
					</div>
					<div className="flex flex-col gap-0">
						<span className="font-semibold text-sm capitalize">
							{buddy.name}
						</span>
						<span className="text-xs text-muted-foreground">
							Your buddy Pokémon
						</span>
					</div>
				</div>
			) : (
				<div className="flex items-center gap-3 rounded-lg border border-dashed border-border p-3 text-muted-foreground">
					<div className="size-14 shrink-0 rounded-full bg-muted/50 flex items-center justify-center text-xl">
						?
					</div>
					<div className="flex flex-col gap-0">
						<span className="text-sm font-medium">No buddy selected</span>
						<span className="text-xs">Pick a Pokémon from your collection</span>
					</div>
				</div>
			)}

			<Popover onOpenChange={setOpen} open={open}>
				<PopoverTrigger asChild>
					<Button
						aria-expanded={open}
						className="w-full justify-between"
						role="combobox"
						variant="outline"
					>
						{buddy ? `Change buddy` : "Choose a buddy"}
						<CaretUpDownIcon className="ml-2 shrink-0 opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent align="start" className="w-64 p-0">
					<Command shouldFilter={false}>
						<CommandInput
							onValueChange={setSearch}
							placeholder="Search your collection..."
							value={search}
						/>
						<CommandList>
							<CommandEmpty>No Pokémon found.</CommandEmpty>
							<CommandGroup>
								{filtered.slice(0, 50).map((option) => (
									<CommandItem
										key={option.id}
										onSelect={() => handleSelect(option.id)}
										value={option.id}
									>
										<div className="relative size-8 shrink-0">
											<Image
												alt={option.name}
												className="object-contain"
												fill
												sizes="32px"
												src={option.spriteUrl}
											/>
										</div>
										<span className="capitalize ml-1">{option.name}</span>
										<CheckIcon
											className={cn(
												"ml-auto shrink-0",
												buddy?.id === option.id ? "opacity-100" : "opacity-0",
											)}
										/>
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		</div>
	);
}
