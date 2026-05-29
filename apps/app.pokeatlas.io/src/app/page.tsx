import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { SearchParams } from "nuqs/server";

import { GlobalFooter } from "@/components/global/footer";
import { GlobalNavigation } from "@/components/global/navigation";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { Pokedex } from "@/features/pokedex";
import { browsePokedexQueryOptions } from "@/features/pokedex/api/query-options";
import { loadPokedexFilters } from "@/features/pokedex/filters/filter.loader";
import { WorkspaceProvider } from "@/features/pokedex/workspace/workspace-provider";
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

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<main>
				<GlobalNavigation />
				<WorkspaceProvider trainerId={trainerId()}>
					<Pokedex />
				</WorkspaceProvider>
				<GlobalFooter />
			</main>
			<ScrollToTop />
		</HydrationBoundary>
	);
}
