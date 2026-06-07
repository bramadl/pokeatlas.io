import type {
	BrowsePokedexInput,
	GetCatchOfTheDayInput,
	GetProgressSummaryInput,
} from "@pokepulse/core/server";

export type GetProgressSummaryQueryOptions = GetProgressSummaryInput;
export type GetCatchOfTheDayQueryOptions = GetCatchOfTheDayInput;

export type BrowsePokedexQueryOptions = Omit<
	BrowsePokedexInput,
	"pagination"
> & { limit: number };

export const progressQueryKeys = {
	all: () => ["progress"] as const,
	getCatchOfTheDay: (input: GetCatchOfTheDayQueryOptions) => {
		return [...progressQueryKeys.all(), "catch-of-the-day", input] as const;
	},
	getSummary: (input: GetProgressSummaryQueryOptions) => {
		return [...progressQueryKeys.all(), "summary", input] as const;
	},
};

export const pokedexQueryKeys = {
	all: () => ["pokedex"] as const,
	browse: (input: Omit<BrowsePokedexQueryOptions, "limit">) => {
		return [...pokedexQueryKeys.all(), "browse", input] as const;
	},
};
