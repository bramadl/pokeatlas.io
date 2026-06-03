import type { BrowsePokedexInput, BrowsePokedexOutput } from "./query";

export interface IBrowsePokedexQueryService {
	browse(input: BrowsePokedexInput): Promise<BrowsePokedexOutput>;
}
