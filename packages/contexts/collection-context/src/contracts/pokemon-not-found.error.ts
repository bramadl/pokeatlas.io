export class PokemonNotFoundError extends Error {
	public constructor(ref: string) {
		super(`Pokemon not found: ${ref}`);
	}
}
