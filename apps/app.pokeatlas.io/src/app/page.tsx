import { atlas } from "@pokeatlas/core";

export default async function Home() {
	const result = await atlas.collection.browsePokedex({
		trainerId: "00000000-0000-0000-0000-000000000001",
	});

	return (
		<main>
			<p>Showing {result.value().totalEntries} pokemon</p>
			<div className="grid grid-cols-6 gap-4 p-10">
				{result.value().entries.map((pokemon) => (
					<div key={pokemon.id}>{pokemon.name}</div>
				))}
			</div>
		</main>
	);
}
