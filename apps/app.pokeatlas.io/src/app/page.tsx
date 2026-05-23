import { atlas } from "@pokeatlas/core";

export default async function Home() {
	const result = await atlas.collection.browsePokedex({
		trainerId: "00000000-0000-0000-0000-000000000001",
	});

	if (result.isError()) {
		return (
			<main>
				<p>Error: {String(result.error())}</p>
			</main>
		);
	}

	const { entries, totalEntries } = result.value();

	return (
		<main>
			<p>Showing {totalEntries} pokemon</p>
			<div className="grid grid-cols-6 gap-4 p-10">
				{entries.map((pokemon) => (
					<div
						key={pokemon.id}
						style={{ opacity: pokemon.isTracked ? 1 : 0.4 }}
					>
						{pokemon.name}
					</div>
				))}
			</div>
		</main>
	);
}
