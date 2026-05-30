"use client";

import { PokedexEntries } from "./pokedex-entries";
import { PokedexGrid } from "./pokedex-grid";
import { PokedexToolbar } from "./pokedex-toolbar";
import { usePokedex } from "./use-pokedex";
import { usePokedexEntries } from "./use-pokedex-entries";
import { usePokedexParams } from "./use-pokedex-params";
import { usePokedexProgressBar } from "./use-pokedex-progress-bar";
import { useWorkspace } from "./workspace/workspace.context";

export function Pokedex() {
	const { trainerId } = useWorkspace();
	const { dex, filters } = usePokedexParams({ trainerId });

	const pokedex = usePokedex({ dex, filters, trainerId });
	const entries = usePokedexEntries({
		data: pokedex.data,
		status: filters ? filters.status : undefined,
	});

	usePokedexProgressBar({
		show: {
			when:
				(pokedex.isLoading || pokedex.isLoadingMoreData) &&
				!entries.hasAnyInflights,
		},
	});

	return (
		<section className="container mx-auto bg-slate-50 sm:my-8">
			<PokedexToolbar />
			<PokedexGrid isLoading={pokedex.isLoading && !entries.hasAnyInflights}>
				<PokedexEntries
					entries={entries.entries}
					showEmpty={pokedex.showEmpty}
					showSkeleton={pokedex.showSkeleton || entries.hasOptimisticEmpty}
					statusTab={pokedex.filters?.status}
				/>
			</PokedexGrid>
			<div ref={pokedex.sentinel} />
		</section>
	);
}
