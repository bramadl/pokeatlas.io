export const POKEMON_TYPES = [
	"bug",
	"dark",
	"dragon",
	"electric",
	"fairy",
	"fighting",
	"fire",
	"flying",
	"ghost",
	"grass",
	"ground",
	"ice",
	"normal",
	"poison",
	"psychic",
	"rock",
	"steel",
	"water",
] as const;

export type PokemonType = (typeof POKEMON_TYPES)[number];
export namespace PokemonTypeRef {
	export function from(value: string): PokemonType {
		if (!(POKEMON_TYPES as readonly string[]).includes(value.toLowerCase())) {
			throw new Error(`Invalid PokemonType: ${value}`);
		}
		return value.toLowerCase() as PokemonType;
	}
}

export const TYPES_ALIASES: Record<PokemonType, string> = {
	bug: "bg",
	dark: "dk",
	dragon: "dr",
	electric: "el",
	fairy: "fy",
	fighting: "fg",
	fire: "fr",
	flying: "fl",
	ghost: "gh",
	grass: "gs",
	ground: "gd",
	ice: "ic",
	normal: "no",
	poison: "ps",
	psychic: "pc",
	rock: "rk",
	steel: "st",
	water: "wt",
} as const;
