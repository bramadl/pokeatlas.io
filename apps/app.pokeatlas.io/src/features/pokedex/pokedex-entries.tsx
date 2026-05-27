import type {
	BrowsePokedexInput,
	BrowsePokedexOutput,
} from "@pokeatlas/core/types";
import { getGenerationLabel } from "./generation.constants";
import { PokemonCard } from "./pokemon-card";

// ----- Helper components ------------------------------------------------------

function PokedexSectionHeader({ label }: { label: string }) {
	return (
		<div className="col-span-full flex items-center gap-4 px-4 pt-6 pb-2">
			<div className="flex-1 h-px bg-linear-to-r from-transparent via-green-300 to-transparent" />
			<div className="flex items-center gap-2 bg-green-50 text-green-800 border border-green-200 rounded-full px-5 py-2.5">
				<p className="font-bold text-sm">{label}</p>
			</div>
			<div className="flex-1 h-px bg-linear-to-r from-transparent via-green-300 to-transparent" />
		</div>
	);
}

// ----- Main components --------------------------------------------------------

interface PokedexEntriesProps {
	dex: BrowsePokedexInput["dex"];
	entries: BrowsePokedexOutput["entries"];
}

export function PokedexEntries({ dex, entries }: PokedexEntriesProps) {
	const isNationalDex = !dex || dex === "NATIONAL";
	let lastGenLabel = "";
	let lastSortGroup = -1;

	return entries.flatMap((pokemon, index) => {
		const nodes: React.ReactNode[] = [];

		if (isNationalDex) {
			const genLabel = getGenerationLabel(pokemon.dex);
			if (genLabel !== lastGenLabel) {
				lastGenLabel = genLabel;
				nodes.push(
					<PokedexSectionHeader key={`gen-${genLabel}`} label={genLabel} />,
				);
			}
		} else {
			if (pokemon.sortGroup !== lastSortGroup) {
				lastSortGroup = pokemon.sortGroup;
				if (pokemon.sortGroup === 1) {
					nodes.push(
						<PokedexSectionHeader
							key="regional-forms"
							label="Regional Forms"
						/>,
					);
				}
			}
		}

		nodes.push(
			<PokemonCard
				key={pokemon.id}
				pokemon={pokemon}
				shouldPreload={index <= 16}
			/>,
		);

		return nodes;
	});
}
