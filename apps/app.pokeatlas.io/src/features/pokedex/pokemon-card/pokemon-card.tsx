import { useState } from "react";

import { PokemonCardContext } from "./card.context";
import type { Pokemon } from "./card.types";
import { CardBackground } from "./ui/card-background";
import { CardBadge } from "./ui/card-badge";
import { CardComposer } from "./ui/card-composer";
import { CardContainer } from "./ui/card-container";
import { CardContent } from "./ui/card-content";
import { CardImage } from "./ui/card-image";
import { CardPointer } from "./ui/card-pointer";
import { CardTrackLog } from "./ui/card-track-log";

interface PokemonCardProps {
	pokemon: Pokemon;
	shouldPreload?: boolean;
}

export function PokemonCard({ pokemon, shouldPreload }: PokemonCardProps) {
	const [isTrackLogShown, setIsTrackLogShown] = useState<boolean>(false);
	return (
		<PokemonCardContext.Provider
			value={{
				isTrackLogShown,
				pokemon,
				setIsTrackLogShown: () => setIsTrackLogShown((prev) => !prev),
			}}
		>
			<CardComposer ContextComponent={CardTrackLog}>
				<CardContainer>
					<CardImage shouldPreload={shouldPreload} />
					<div className="size-full">
						<CardBackground />
						<CardContent />
						<CardBadge />
					</div>
					<CardPointer />
				</CardContainer>
			</CardComposer>
		</PokemonCardContext.Provider>
	);
}
