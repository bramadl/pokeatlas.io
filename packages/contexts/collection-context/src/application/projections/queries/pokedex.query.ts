import type {
	BrowsePokedexInput,
	BrowsePokedexOutput,
} from "../../queries/browse-pokedex/query";

export interface IPokedexQueryService {
	browsePokedex(input: BrowsePokedexInput): Promise<BrowsePokedexOutput>;
}
