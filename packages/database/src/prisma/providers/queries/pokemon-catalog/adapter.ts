import type { IPokemonCatalog, PokemonEntry } from "@context/collection";
import { prisma } from "@prisma-client";

import { mapPokemonEntry } from "./adapter.mapper";

export class PrismaPokemonCatalogAdapter implements IPokemonCatalog {
	public async findByRef(pokemonRef: string): Promise<PokemonEntry | null> {
		const data = await prisma.pokemonFormModel.findFirst({
			include: { primaryType: true, secondaryType: true, species: true },
			where: { form: pokemonRef },
		});

		if (!data) return null;
		return mapPokemonEntry(data);
	}
}
