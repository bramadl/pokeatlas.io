import type {
	BasePokedexInput,
	BrowsePokedexInput,
	BrowsePokedexOutput,
	CountPokedexInput,
	CountPokedexOutput,
	IPokedex,
} from "@context/collection/types";

import { prisma } from "#prisma-client";
import type { PokemonModelWhereInput } from "#prisma-client/models.ts";

import { toEntry } from "./adapter.mapper";
import { classificationFilter } from "./filters/classification.filter";
import { dexFilter } from "./filters/dex.filter";
import { searchFilter } from "./filters/search.filter";
import { statusFilter } from "./filters/status.filter";
import { typesFilter } from "./filters/types.filter";
import { variantsFilter } from "./filters/variants.filter";

export class PrismaPokedexServiceAdapter implements IPokedex {
	private async buildWhere({
		dex,
		filters,
		trainerId,
	}: BasePokedexInput): Promise<PokemonModelWhereInput> {
		const conditions = await Promise.all([
			dexFilter(dex),
			classificationFilter(filters?.classification),
			searchFilter(filters?.search),
			statusFilter(filters?.status, trainerId),
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

	public async browse({
		dex,
		trainerId,
		pagination: { limit, cursor },
		...input
	}: BrowsePokedexInput): Promise<BrowsePokedexOutput> {
		const rows = await prisma.pokemonModel.findMany({
			take: limit + 1,
			where: await this.buildWhere({ dex, trainerId, ...input }),
			...(cursor ? { cursor: { ref: cursor }, skip: 1 } : {}),
			orderBy: [
				{ formSortGroup: "asc" },
				{ pokedexNumber: "asc" },
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
				isTemporaryEvolution: true,
				pokedexNumber: true,
				pokemonClassification: true,
				primaryType: {
					select: { name: true, templateId: true },
				},
				ref: true,
				regularSprite: true,
				secondaryType: {
					select: { name: true, templateId: true },
				},
				shinySprite: true,
				speciesName: true,
				trackedPokemons: {
					select: {
						createdAt: true,
						trackedStates: true,
						updatedAt: true,
					},
					where: { trainerId },
				},
			},
		});

		const hasMore = rows.length > limit;
		const entries = hasMore ? rows.slice(0, limit) : rows;
		const last = entries[entries.length - 1] ?? null;

		return {
			entries: entries.map(toEntry),
			hasMore,
			nextCursor: last?.ref ?? null,
		};
	}

	public async count(input: CountPokedexInput): Promise<CountPokedexOutput> {
		return prisma.pokemonModel.count({ where: await this.buildWhere(input) });
	}
}
