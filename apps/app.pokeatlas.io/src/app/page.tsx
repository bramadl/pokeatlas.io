import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { SearchParams } from "nuqs/server";

import { GlobalFooter } from "@/components/global/footer";
import { GlobalNavigation } from "@/components/global/navigation";
import { Pokedex } from "@/features/pokedex";
import {
	browsePokedexQueryOptions,
	countPokedexQueryOptions,
} from "@/features/pokedex/api/query-options";
import { loadPokedexFilters } from "@/features/pokedex/filters/filter.loader";
import { getQueryClient } from "@/lib/tanstack/query/get-query-client";
import { trainerId } from "@/lib/trainer-id";

interface PageProps {
	searchParams: Promise<SearchParams>;
}

export default async function Home({ searchParams }: PageProps) {
	const { dex, filters } = await loadPokedexFilters(searchParams);

	const queryClient = getQueryClient();

	void (await queryClient.prefetchInfiniteQuery(
		browsePokedexQueryOptions({ dex, filters, trainerId: trainerId() }),
	));

	void (await queryClient.prefetchQuery(
		countPokedexQueryOptions({ dex, filters, trainerId: trainerId() }),
	));

	return (
		<main>
			<GlobalNavigation />
			<HydrationBoundary state={dehydrate(queryClient)}>
				<Pokedex trainerId={trainerId()} />
			</HydrationBoundary>
			<GlobalFooter />
		</main>
	);
}
