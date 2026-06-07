import type { PokemonRef } from "@context/game";
import type {
	IPokedexMetadata,
	PokemonMetadata,
	PokemonTraits,
} from "@context/progress/contracts";

import { prisma } from "#prisma-client";

export class PrismaPokedexMetadataAdapter implements IPokedexMetadata {
	public async getMetadata(
		pokemonRef: PokemonRef,
	): Promise<PokemonMetadata | null> {
		const row = await prisma.pokemonModel.findUnique({
			select: {
				formName: true,
				pokedexNumber: true,
				primaryType: { select: { name: true } },
				region: true,
				regularSprite: true,
				secondaryType: { select: { name: true } },
				shinySprite: true,
			},
			where: { ref: pokemonRef },
		});

		if (!row) return null;

		return {
			dexNumber: row.pokedexNumber,
			name: row.formName,
			primaryType: row.primaryType.name,
			region: row.region as PokemonMetadata["region"],
			secondaryType: row.secondaryType?.name ?? null,
			sprite: {
				shiny: row.shinySprite,
				url: row.regularSprite,
			},
		};
	}

	public async getTraits(
		pokemonRef: PokemonRef,
	): Promise<PokemonTraits | null> {
		const row = await prisma.pokemonModel.findUnique({
			select: {
				formCategory: true,
				isCostume: true,
				isDefaultForm: true,
				isFemale: true,
				isShadowAvailable: true,
				isTemporaryEvolution: true,
				isTradable: true,
				pokedexNumber: true,
				pokemonClassification: true,
				ref: true,
				region: true,
			},
			where: { ref: pokemonRef },
		});

		if (!row) return null;

		return {
			formCategory: row.formCategory as PokemonTraits["formCategory"],
			isCostume: row.isCostume,
			isDefaultForm: row.isDefaultForm,
			isFemale: row.isFemale,
			isShadowAvailable: row.isShadowAvailable,
			isTemporaryEvolution: row.isTemporaryEvolution,
			isTradable: row.isTradable,
			pokedexNumber: row.pokedexNumber,
			pokemonClassification:
				row.pokemonClassification as PokemonTraits["pokemonClassification"],
			ref: row.ref,
			region: row.region as PokemonTraits["region"],
		};
	}
}
