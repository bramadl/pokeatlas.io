import type {
	BrowsePokedexInput,
	BrowsePokedexOutput,
	IBrowsePokedexQueryService,
} from "@context/collection";

import { prisma } from "../../../client";

export class PrismaTrainerPokedexQueryService
	implements IBrowsePokedexQueryService
{
	public async from({
		trainerId,
	}: BrowsePokedexInput): Promise<BrowsePokedexOutput> {
		const trainerPokedex = await prisma.trainerPokedexProjection.findMany({
			orderBy: [
				{ dexNumber: "asc" },
				{ formPriority: "asc" },
				{ pokemonName: "asc" },
			],
			where: { trainerRef: trainerId },
		});

		return {
			entries: trainerPokedex.map((entry) => {
				return {
					id: entry.pokemonRef,
					isTracked: entry.isTracked ?? false,
					name: entry.pokemonName,
					sprites: {
						shinyUrl: entry.shinyImageUrl,
						url: entry.imageUrl,
					},
				};
			}),
			totalEntries: trainerPokedex.length,
		};
	}
}
