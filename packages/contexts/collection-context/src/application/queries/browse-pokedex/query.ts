import type { BrowsePokedexInput } from "../services/pokedex.service";

export type {
	BrowsePokedexInput,
	BrowsePokedexOutput,
} from "../services/pokedex.service";

export class BrowsePokedexQuery {
	public constructor(public readonly input: BrowsePokedexInput) {}
}
