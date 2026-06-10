import type { TrackableState } from "@pokepulse/core";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import type { SearchParams } from "nuqs/server";

import { GlobalNavigation } from "@/components/global/navigation";
import { getQueryClient } from "@/lib/tanstack/query/query-client";

import { getTrainer } from "../(auth)/api/auth/auth.api";
import { Pokedex } from "./pokedex";
import { pokedexQueries } from "./pokedex.query";
import { PokedexStoreProvider } from "./pokedex.store-provider";
import {
	loadPokedexFilters,
	PokedexToolbar,
	PokedexToolbarPanel,
} from "./toolbar";
import { Workspace } from "./workspace";

const DEFAULT_POKEDEX_LIMIT = 60;
const DEFAULT_TRACKING_SIGNATURE: TrackableState = "BASE";

interface PageProps {
	searchParams: Promise<SearchParams>;
}

export default async function Page({ searchParams }: PageProps) {
	const [trainer, filters] = await Promise.all([
		getTrainer(),
		loadPokedexFilters.parse(searchParams),
	]);

	if (!trainer) redirect("/");
	const { trainerId } = trainer;

	const queryClient = getQueryClient();
	await queryClient.prefetchInfiniteQuery(
		pokedexQueries.browse({
			filters,
			limit: DEFAULT_POKEDEX_LIMIT,
			trackingSignature: DEFAULT_TRACKING_SIGNATURE,
			trainerId,
		}),
	);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<GlobalNavigation trainer={trainer.user} />
			<PokedexStoreProvider
				initialPokedexEntriesLimit={DEFAULT_POKEDEX_LIMIT}
				initialTrackingSignature={DEFAULT_TRACKING_SIGNATURE}
				trainerId={trainerId}
			>
				<Workspace>
					<PokedexToolbar>
						<PokedexToolbarPanel />
					</PokedexToolbar>
					<Pokedex />
				</Workspace>
			</PokedexStoreProvider>
		</HydrationBoundary>
	);
}
