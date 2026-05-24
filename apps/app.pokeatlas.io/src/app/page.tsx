import { atlas } from "@pokeatlas/core";
import { GlobalFooter } from "@/components/global/global-footer";
import { GlobalNavigation } from "@/components/global/global-navigation";
import { Pokedex } from "@/features/pokedex";

const TRAINER_ID = "00000000-0000-0000-0000-000000000001";

export default async function Home({
	searchParams,
}: {
	searchParams: Promise<{ search?: string }>;
}) {
	const { search } = await searchParams;

	const result = await atlas.collection.browsePokedex({
		limit: 60,
		page: 1,
		search,
		trainerId: TRAINER_ID,
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
