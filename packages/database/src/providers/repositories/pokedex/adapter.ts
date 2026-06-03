import type { IPokedex } from "@context/collection";
import type { PokemonRef } from "@context/shared";

import { prisma } from "#prisma-client";

export class PrismaPokedexAdapter implements IPokedex {
	public async checkExistence(ref: PokemonRef): Promise<boolean> {
		const count = await prisma.pokemonModel.count({ where: { ref } });
		return count > 0;
	}
}
