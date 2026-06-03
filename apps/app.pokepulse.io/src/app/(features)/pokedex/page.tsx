import type { TrackableState } from "@pokepulse/core";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { SearchParams } from "nuqs/server";

import { getQueryClient } from "@/lib/tanstack/query/query-client";

import { Pokedex } from "./pokedex";
import { pokedexQueries } from "./pokedex.query";
import { PokedexStoreProvider } from "./pokedex.store-provider";
import {
	loadPokedexFilters,
	PokedexToolbar,
	PokedexToolbarPanel,
} from "./toolbar";
import { Workspace } from "./workspace";

const DEFAULT_POKEDEX_LIMIT = 30;
const DEFAULT_TRACKING_SIGNATURE: TrackableState = "BASE";
const TRAINER_ID = "00000000-0000-0000-0000-000000000001";

interface PageProps {
	searchParams: Promise<SearchParams>;
}

export default async function Page({ searchParams }: PageProps) {
	const filters = await loadPokedexFilters.parse(searchParams);

	const queryClient = getQueryClient();
	void (await queryClient.prefetchInfiniteQuery({
		...pokedexQueries.browse({
			filters,
			limit: DEFAULT_POKEDEX_LIMIT,
			trackingSignature: DEFAULT_TRACKING_SIGNATURE,
			trainerId: TRAINER_ID,
		}),
	}));

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<main>
				<PokedexStoreProvider
					initialPokedexEntriesLimit={DEFAULT_POKEDEX_LIMIT}
					initialTrackingSignature={DEFAULT_TRACKING_SIGNATURE}
					trainerId={TRAINER_ID}
				>
					<Workspace>
						<PokedexToolbar>
							<PokedexToolbarPanel />
						</PokedexToolbar>
						<Pokedex />
					</Workspace>
				</PokedexStoreProvider>
			</main>
		</HydrationBoundary>
	);
}
