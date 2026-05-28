// import type { IPokemonCatalog } from "@context/collection/types";

// import { prisma } from "#prisma-client";

// export class PrismaPokemonCatalogAdapter implements IPokemonCatalog {
// 	public async exists(pokemonRef: string): Promise<boolean | null> {
// 		const amount = await prisma.pokemonFormModel.count({
// 			where: { form: pokemonRef },
// 		});

// 		return amount !== 0;
// 	}
// }
