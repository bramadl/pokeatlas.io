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

import { usePokemonCard } from "../use-pokemon-card";

export function CardComposer({
	children,
	Context,
}: React.ComponentProps<"div"> & {
	Context: () => React.JSX.Element;
}) {
	const { pokemon, setIsTrackLogShown, isTrackLogShown } = usePokemonCard();
	const isMobile = useMediaQuery("(max-width: 860px)", {
		initializeWithValue: false,
	});

	if (isMobile) {
		return (
			<Fragment>
				{children}
				<Drawer onOpenChange={setIsTrackLogShown} open={isTrackLogShown}>
					<DrawerContent className="px-4 pb-8">
						<DrawerTitle className="sr-only">{pokemon.name}</DrawerTitle>
						<DrawerDescription className="sr-only">
							Track Log for {pokemon.name}
						</DrawerDescription>
						<div className="mt-4 scrollbar-none overflow-y-auto p-4">
							<Context />
						</div>
					</DrawerContent>
				</Drawer>
			</Fragment>
		);
	}

	return (
		<Popover modal onOpenChange={setIsTrackLogShown} open={isTrackLogShown}>
			<PopoverAnchor asChild>{children}</PopoverAnchor>
			<PopoverContent
				align="center"
				className="min-w-96 w-auto ring-transparent"
				side="right"
			>
				<Context />
				<PopoverPrimitive.Arrow className="fill-white" />
			</PopoverContent>
		</Popover>
	);
}
