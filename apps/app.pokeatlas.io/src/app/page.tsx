import { atlas } from "@pokeatlas/core";
import Image from "next/image";
import Link from "next/link";

interface HomeProps {
	searchParams: Promise<{ search?: string; page?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
	const { search, page } = await searchParams;

	const currentPage = page ? parseInt(page, 10) : 1;
	const ITEMS_PER_PAGE = 100;

	const result = await atlas.collection.browsePokedex({
		limit: ITEMS_PER_PAGE,
		page: currentPage,
		search: search,
		trainerId: "00000000-0000-0000-0000-000000000001",
	});

	if (result.isError()) {
		return (
			<main className="p-10">
				<p>Error: {String(result.error())}</p>
			</main>
		);
	}

	const { entries, totalEntries, hasMore } = result.value();

	const createPageUrl = (pageNumber: number) => {
		const params = new URLSearchParams();
		if (search) params.set("search", search);
		params.set("page", pageNumber.toString());
		return `/?${params.toString()}`;
	};

	return (
		<main className="p-10 max-w-5xl mx-auto">
			<h1 className="text-2xl font-bold mb-4">Pokédex Tracker</h1>

			<form className="mb-6 flex gap-2" method="GET">
				<input
					className="border border-gray-300 rounded px-4 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					defaultValue={search ?? ""}
					name="search"
					placeholder="Search by name or number (e.g., 025, pikachu)..."
					type="text"
				/>
				<button
					className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
					type="submit"
				>
					Search
				</button>

				{search && (
					<Link
						className="border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded text-center text-sm flex items-center"
						href="/"
					>
						Clear
					</Link>
				)}
			</form>

			<p className="text-gray-600 mb-4">
				Showing {entries.length} of {totalEntries} Pokémon
			</p>

			<div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 mb-8">
				{entries.map((pokemon, index) => {
					const isAboveTheFold = index < 12;
					return (
						<div
							className="border rounded p-4 flex flex-col items-center bg-white shadow-sm"
							key={pokemon.id.toString()}
							style={{ opacity: pokemon.isTracked ? 1 : 0.4 }}
						>
							<Image
								alt={pokemon.name}
								className="w-20 h-20 object-contain mb-2"
								height={256}
								priority={isAboveTheFold}
								src={pokemon.sprites.url}
								width={256}
							/>
							<span className="capitalize font-medium text-sm text-gray-800">
								{pokemon.name}
							</span>
						</div>
					);
				})}
			</div>

			{entries.length === 0 && (
				<div className="text-center py-10 text-gray-500">
					No Pokémon found for "{search}"
				</div>
			)}

			<div className="flex justify-center items-center gap-4 py-4 border-t">
				{currentPage > 1 && (
					<Link
						className="border px-4 py-2 rounded hover:bg-gray-50"
						href={createPageUrl(currentPage - 1)}
					>
						← Previous
					</Link>
				)}

				<span className="text-sm font-medium text-gray-700">
					Page {currentPage} of {Math.ceil(totalEntries / ITEMS_PER_PAGE)}
				</span>

				{hasMore && (
					<Link
						className="border px-4 py-2 rounded hover:bg-gray-50"
						href={createPageUrl(currentPage + 1)}
					>
						Next →
					</Link>
				)}
			</div>
		</main>
	);
}
