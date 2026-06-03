"use client";

import { useQueryStates } from "nuqs";
import { Fragment } from "react";
import { useShallow } from "zustand/react/shallow";

import { PokedexEmpty } from "./pokedex-empty";
import { PokedexEntry } from "./pokedex-entry";
import { PokedexGrid } from "./pokedex-grid";
import { PokedexLoading } from "./pokedex-loading";
import { PokedexSkeleton } from "./pokedex-skeleton";
import { PokemonCardSkeleton } from "./pokemon";
import { pokedexFilterKeys, pokedexFilterParser } from "./toolbar";
import { usePokedex } from "./use-pokedex";
import { usePokedexStore } from "./use-pokedex-store";

export function Pokedex() {
	const [filters] = useQueryStates(pokedexFilterParser, {
		urlKeys: pokedexFilterKeys,
	});

	const { isEraserActive, limit, trainerId, trackingSignature } =
		usePokedexStore(
			useShallow((s) => ({
				isEraserActive: s.isEraserActive,
				limit: s.limit,
				trackingSignature: s.trackingSignature,
				trainerId: s.trainerId,
			})),
		);

	const { entries, isDeferring, isFetching, isPlaceholderData, sentinel } =
		usePokedex({
			filters,
			pokedexLimit: limit,
			trackingSignature,
			trainerId,
		});

	const showEmpty = !isPlaceholderData && entries.length === 0 && !isDeferring;
	if (showEmpty) {
		return (
			<PokedexEmpty signature={trackingSignature} status={filters.status} />
		);
	}

	const showLoading =
		(isPlaceholderData || isDeferring) && entries.length === 0;
	if (showLoading) return <PokedexLoading />;

	const showSkeleton =
		!showEmpty && !showLoading && entries.length === 0 && isDeferring;
	if (showSkeleton) return <PokedexSkeleton content={PokemonCardSkeleton} />;

	return (
		<Fragment>
			<PokedexGrid loading={isFetching || isDeferring}>
				{entries.map((entry) => (
					<PokedexEntry
						entry={entry}
						isEraserActive={isEraserActive}
						key={entry.species.id}
						trackingSignature={trackingSignature}
						trackingStatus={filters.status}
						trainerId={trainerId}
					/>
				))}
			</PokedexGrid>
			<div ref={sentinel} />
		</Fragment>
	);
}
