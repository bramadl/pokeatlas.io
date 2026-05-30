import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { SearchParams } from "nuqs/server";

import { GlobalFooter } from "@/components/global/footer";
import { GlobalNavigation } from "@/components/global/navigation";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { browsePokedexQueryOptions } from "@/features/global/api/query-options";
import { Pokedex } from "@/features/pokedex";
import { loadPokedexFilters } from "@/features/pokedex/filters/filter.loader";
import { WorkspaceProvider } from "@/features/workspace/workspace-provider";
import { getQueryClient } from "@/lib/tanstack/query/get-query-client";

const TRAINER_ID = "00000000-0000-0000-0000-000000000001";

interface PageProps {
	searchParams: Promise<SearchParams>;
}

export default async function Home({ searchParams }: PageProps) {
	const { dex, filters } = await loadPokedexFilters(searchParams);

	const queryClient = getQueryClient();
	void (await queryClient.prefetchInfiniteQuery(
		browsePokedexQueryOptions({ dex, filters, trainerId: TRAINER_ID }),
	));

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<main>
				<GlobalNavigation />
				<WorkspaceProvider trainerId={TRAINER_ID}>
					<Pokedex />
				</WorkspaceProvider>
				<GlobalFooter />
			</main>
			<ScrollToTop />
		</HydrationBoundary>
	);
}
