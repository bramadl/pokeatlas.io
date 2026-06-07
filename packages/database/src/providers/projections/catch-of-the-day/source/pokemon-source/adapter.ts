import type { TrackingSignatureRef } from "@context/collection";
import {
	PokemonClassificationRef,
	PokemonFormRef,
	PokemonRef,
	PokemonRegionRef,
	PokemonTypeRef,
} from "@context/game";
import type { CatchOfTheDayCandidate, IPokemonSource } from "@context/progress";

import { prisma } from "#prisma-client";

export class PrismaPokemonSourceAdapter implements IPokemonSource {
	public async fetchCandidates(
		trainerId: string,
	): Promise<CatchOfTheDayCandidate[]> {
		const rows = await prisma.pokemonModel.findMany({
			select: {
				formCategory: true,
				formName: true,
				isCostume: true,
				isDefaultForm: true,
				isFemale: true,
				isShadowAvailable: true,
				isTemporaryEvolution: true,
				isTradable: true,
				pokedexNumber: true,
				pokemonClassification: true,
				primaryType: { select: { name: true } },
				ref: true,
				region: true,
				regularSprite: true,
				secondaryType: { select: { name: true } },
				shinySprite: true,
				trackedPokemons: {
					select: { trackedStates: true },
					where: { trainerId },
				},
			},
			where: {
				isCostume: false,
				isTrackable: true,
			},
		});

		return rows.map<CatchOfTheDayCandidate>((row) => ({
			dexNumber: row.pokedexNumber,
			name: row.formName,
			ownedSignatures: new Set(
				(row.trackedPokemons[0]?.trackedStates ?? []) as TrackingSignatureRef[],
			),
			pokemonRef: PokemonRef.from(row.ref),
			primaryType: PokemonTypeRef.from(row.primaryType.name),
			secondaryType: row.secondaryType
				? PokemonTypeRef.from(row.secondaryType.name)
				: null,
			shinySprite: row.shinySprite,
			sprite: row.regularSprite,
			traits: {
				formCategory: PokemonFormRef.from(row.formCategory),
				isCostume: row.isCostume,
				isDefaultForm: row.isDefaultForm,
				isFemale: row.isFemale,
				isShadowAvailable: row.isShadowAvailable,
				isTemporaryEvolution: row.isTemporaryEvolution,
				isTradable: row.isTradable,
				pokedexNumber: row.pokedexNumber,
				pokemonClassification: row.pokemonClassification
					? PokemonClassificationRef.from(row.pokemonClassification)
					: null,
				ref: PokemonRef.from(row.ref),
				region: PokemonRegionRef.from(row.region),
			},
		}));
	}
}
