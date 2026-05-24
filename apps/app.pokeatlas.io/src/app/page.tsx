import { atlas } from "@pokeatlas/core";

import { GlobalFooter } from "@/components/global/global-footer";
import { GlobalNavigation } from "@/components/global/global-navigation";
import { Pokedex } from "@/features/pokedex";
import { parseFiltersFromParams } from "@/features/pokedex/filter-tool/filter.types";

const TRAINER_ID = "00000000-0000-0000-0000-000000000001";

export default async function Home({ searchParams }: PageProps<"/">) {
	const params = await searchParams;
	const search = params.search as string | undefined;

	const filters = parseFiltersFromParams(
		params as Record<string, string | string[] | undefined>,
	);

	const result = await atlas.collection.browsePokedex({
		form: filters.form !== "all" ? filters.form : undefined,
		limit: 60,
		page: 1,
		search,
		status: filters.status !== "all" ? filters.status : undefined,
		trainerId: TRAINER_ID,
		types: filters.types.length ? filters.types : undefined,
	});

	if (result.isError()) {
		return (
			<main>
				<p>Error: {String(result.error())}</p>
			</main>
		);
	}

	const { entries, hasMore, totalEntries } = result.value();
	return (
		<main>
			<GlobalNavigation />
			<Pokedex
				initialEntries={entries}
				initialHasMore={hasMore}
				initialSearch={search ?? ""}
				totalEntries={totalEntries}
			/>
			<GlobalFooter />
		</main>
	);
}
