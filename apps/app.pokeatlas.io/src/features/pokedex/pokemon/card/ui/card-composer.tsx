"use client";

import { Popover as PopoverPrimitive } from "radix-ui";
import { Fragment } from "react/jsx-runtime";
import { useMediaQuery } from "usehooks-ts";

import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerTitle,
} from "@/components/ui/drawer";
import {
	Popover,
	PopoverAnchor,
	PopoverContent,
} from "@/components/ui/popover";

import type { PokemonCardContextValue } from "../card.context";
import { usePokemonCard } from "../use-pokemon-card";

interface CardComposerProps extends React.ComponentProps<"div"> {
	Breakpoint?: string;
	Context?: (props: PokemonCardContextValue) => React.JSX.Element;
}

export function CardComposer({
	Breakpoint = "(max-width: 860px)",
	Context,
	children,
}: CardComposerProps) {
	const context = usePokemonCard();

	const { pokemon, setIsTrackLogShown, isTrackLogShown } = context;
	const isMobile = useMediaQuery(Breakpoint, { initializeWithValue: false });

	if (isMobile) {
		return (
			<Fragment>
				{children}
				{Context && (
					<Drawer onOpenChange={setIsTrackLogShown} open={isTrackLogShown}>
						<DrawerContent className="px-4 pb-8">
							<DrawerTitle className="sr-only">{pokemon.name}</DrawerTitle>
							<DrawerDescription className="sr-only">
								Track Log for {pokemon.name}
							</DrawerDescription>
							<div className="mt-4 scrollbar-none overflow-y-auto p-4">
								<Context {...context} />
							</div>
						</DrawerContent>
					</Drawer>
				)}
			</Fragment>
		);
	}

	return (
		<Popover modal onOpenChange={setIsTrackLogShown} open={isTrackLogShown}>
			<PopoverAnchor asChild>{children}</PopoverAnchor>
			{Context && (
				<PopoverContent
					align="start"
					className="min-w-96 w-auto ring-transparent"
					side="right"
				>
					<Context {...context} />
					<PopoverPrimitive.Arrow className="fill-white" />
				</PopoverContent>
			)}
		</Popover>
	);
}
