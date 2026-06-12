import type {
	BrowsePokedexInput,
	BrowsePokedexOutput,
	IBrowsePokedexQueryService,
} from "@context/collection";
import { isGuest } from "@context/game";

import { prisma } from "#prisma-client";
import type { PokemonModelWhereInput } from "#prisma-client/models";

import { toPokedexEntry } from "./adapter.mapper";
import { classificationsFilter } from "./filters/classifications.filter";
import { pokedexFilter } from "./filters/pokedex.filter";
import { searchFilter } from "./filters/search.filter";
import { statusFilter } from "./filters/status.filter";
import { typesFilter } from "./filters/types.filter";
import { variantsFilter } from "./filters/variants.filter";

export class PrismaBrowsePokedexQueryServiceAdapter
	implements IBrowsePokedexQueryService
{
	private async buildWhere({
		filters,
		trackingSignature,
		trainerId,
	}: BrowsePokedexInput): Promise<PokemonModelWhereInput> {
		const conditions = await Promise.all([
			classificationsFilter(filters?.classifications),
			pokedexFilter(filters?.pokedex),
			searchFilter(filters?.search),
			statusFilter(filters?.status, trackingSignature, trainerId),
			typesFilter(filters?.types),
			variantsFilter(filters?.variants),
			{ isTrackable: true },
		]);

		const andConditions = conditions.filter(
			Boolean,
		) as PokemonModelWhereInput[];

		return andConditions.length === 0
			? {}
			: andConditions.length === 1
				? (andConditions[0] as PokemonModelWhereInput)
				: { AND: andConditions };
	}

	public async browse(input: BrowsePokedexInput): Promise<BrowsePokedexOutput> {
		const where = await this.buildWhere(input);
		const rows = await prisma.pokemonModel.findMany({
			take: input.pagination.limit + 1,
			where,
			...(input.pagination.cursor
				? { cursor: { ref: input.pagination.cursor }, skip: 1 }
				: {}),
			orderBy:
				input.filters?.pokedex === "NATIONAL"
					? [{ pokedexNumber: "asc" }, { formPriority: "asc" }, { ref: "asc" }]
					: [
							{ pokedexNumber: "asc" },
							{ formSortGroup: "asc" },
							{ formPriority: "asc" },
							{ ref: "asc" },
						],
			select: {
				formCategory: true,
				formName: true,
				formPriority: true,
				formSortGroup: true,
				isCostume: true,
				isDefaultForm: true,
				isFemale: true,
				isShadowAvailable: true,
				isTemporaryEvolution: true,
				pokedexNumber: true,
				pokemonClassification: true,
				primaryType: {
					select: { name: true, templateId: true },
				},
				ref: true,
				region: true,
				regularSprite: true,
				secondaryType: {
					select: { name: true, templateId: true },
				},
				shinySprite: true,
				speciesName: true,
				trackedPokemons: isGuest(input.trainerId)
					? false
					: {
							select: {
								createdAt: true,
								trackedStates: true,
								updatedAt: true,
							},
							where: { trainerId: input.trainerId },
						},
			},
		});

		const hasMore = rows.length > input.pagination.limit;
		const entries = hasMore ? rows.slice(0, input.pagination.limit) : rows;
		const last = entries[entries.length - 1] ?? null;

		const result = entries.map(toPokedexEntry);
		return {
			entries: result,
			hasMore,
			nextCursor: hasMore ? (last?.ref ?? null) : null,
		};
	}
}
