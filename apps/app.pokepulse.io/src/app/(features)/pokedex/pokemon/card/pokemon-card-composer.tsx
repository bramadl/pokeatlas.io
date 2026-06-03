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

interface PokemonCardComposerProps<
	TContextProps extends Record<string, unknown>,
> extends React.ComponentProps<"div"> {
	Breakpoint?: string;
	Context?: React.ComponentType<TContextProps>;
	ContextProps?: TContextProps;
	isContextOpened?: boolean;
	onContextChanged: (opened: boolean) => void;
	pokemonName: string;
}

export function PokemonCardComposer<
	TContextProps extends Record<string, unknown>,
>({
	Breakpoint = "(max-width: 860px)",
	Context,
	ContextProps,
	children,
	isContextOpened,
	onContextChanged,
	pokemonName,
}: PokemonCardComposerProps<TContextProps>) {
	const isMobile = useMediaQuery(Breakpoint, { initializeWithValue: false });

	if (isMobile) {
		return (
			<Fragment>
				{children}
				{Context && (
					<Drawer onOpenChange={onContextChanged} open={isContextOpened}>
						<DrawerContent className="px-4 pb-8">
							<DrawerTitle className="sr-only">{pokemonName}</DrawerTitle>
							<DrawerDescription className="sr-only">
								Track Log for {pokemonName}
							</DrawerDescription>
							<div className="mt-4 scrollbar-none overflow-y-auto p-4">
								<Context {...(ContextProps as TContextProps)} />
							</div>
						</DrawerContent>
					</Drawer>
				)}
			</Fragment>
		);
	}

	return (
		<Popover modal onOpenChange={onContextChanged} open={isContextOpened}>
			<PopoverAnchor asChild>{children}</PopoverAnchor>
			{Context && (
				<PopoverContent
					align="start"
					className="min-w-96 w-auto ring-transparent"
					side="right"
				>
					<Context {...(ContextProps as TContextProps)} />
					<PopoverPrimitive.Arrow className="fill-background" />
				</PopoverContent>
			)}
		</Popover>
	);
}
