import type {
	BrowsePokedexInput,
	BrowsePokedexOutput,
	IBrowsePokedexQueryService,
} from "@context/collection";
import { PokemonRef } from "@context/shared";
import { prisma } from "@prisma-client";
import type { TrainerPokedexProjectionWhereInput } from "@prisma-client/models";

export class PrismaTrainerPokedexQueryService
	implements IBrowsePokedexQueryService
{
	public async from({
		search,
		trainerId,
		page = 1,
		limit = 60,
	}: BrowsePokedexInput): Promise<BrowsePokedexOutput> {
		const whereCondition: TrainerPokedexProjectionWhereInput = {
			trainerRef: trainerId,
		};

		if (search && search.trim() !== "") {
			const searchAsNumber = parseInt(search, 10);
			const isNumber = !Number.isNaN(searchAsNumber);

			const searchConditions: TrainerPokedexProjectionWhereInput[] = [
				{ pokemonName: { contains: search, mode: "insensitive" } },
			];

			if (isNumber) searchConditions.push({ dexNumber: searchAsNumber });
			whereCondition.OR = searchConditions;
		}

		const totalEntries = await prisma.trainerPokedexProjection.count({
			where: whereCondition,
		});

		const trainerPokedex = await prisma.trainerPokedexProjection.findMany({
			orderBy: [
				{ dexNumber: "asc" },
				{ formPriority: "asc" },
				{ pokemonName: "asc" },
			],
			skip: (page - 1) * limit,
			take: limit,
			where: whereCondition,
		});

		return {
			entries: trainerPokedex.map((entry) => ({
				id: PokemonRef.from(entry.pokemonRef),
				isTracked: entry.isTracked ?? false,
				name: entry.pokemonName,
				sprites: { shinyUrl: entry.shinyImageUrl, url: entry.imageUrl },
			})),
			hasMore: page * limit < totalEntries,
			totalEntries,
		};
	}
}
