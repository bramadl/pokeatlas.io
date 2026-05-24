import type {
	BrowsePokedexInput,
	BrowsePokedexOutput,
	IPokedexQueryService,
} from "@context/collection";
import { PokemonRef } from "@context/shared";
import { prisma } from "@prisma-client";
import type { PokedexProjectionWhereInput } from "@prisma-client/models";

export class PrismaPokedexQueryService implements IPokedexQueryService {
	public async browsePokedex({
		search,
		trainerId,
		page = 1,
		limit = 60,
	}: BrowsePokedexInput): Promise<BrowsePokedexOutput> {
		const safePage = Math.max(1, page);
		const whereCondition: PokedexProjectionWhereInput = {
			trainerRef: trainerId,
		};

		if (search && search.trim() !== "") {
			const searchAsNumber = parseInt(search, 10);
			const isNumber = !Number.isNaN(searchAsNumber);

			const searchConditions: PokedexProjectionWhereInput[] = [
				{ pokemonName: { contains: search, mode: "insensitive" } },
			];

			if (isNumber) searchConditions.push({ dexNumber: searchAsNumber });
			whereCondition.OR = searchConditions;
		}

		const totalEntries = await prisma.pokedexProjection.count({
			where: whereCondition,
		});

		const trainerPokedex = await prisma.pokedexProjection.findMany({
			orderBy: [
				{ dexNumber: "asc" },
				{ formPriority: "asc" },
				{ pokemonName: "asc" },
			],
			skip: (safePage - 1) * limit,
			take: limit,
			where: whereCondition,
		});

		return {
			entries: trainerPokedex.map((entry) => ({
				dex: entry.dexNumber,
				form: entry.formCategory as
					| "costume"
					| "regional"
					| "alternate"
					| "female"
					| "mega"
					| null,
				id: PokemonRef.from(entry.pokemonRef),
				name: entry.pokemonName,
				sprites: { shinyUrl: entry.shinyImageUrl, url: entry.imageUrl },
				trackedStates: entry.trackedStates,
				types: [entry.primaryType, entry.secondaryType].filter(
					Boolean,
				) as string[],
			})),
			hasMore: safePage * limit < totalEntries,
			totalEntries,
		};
	}
}
