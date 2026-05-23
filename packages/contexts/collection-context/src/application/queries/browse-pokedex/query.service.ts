import type { BrowsePokedexInput, BrowsePokedexOutput } from "./query";

export interface IBrowsePokedexQueryService {
	from(input: BrowsePokedexInput): Promise<BrowsePokedexOutput>;
}
