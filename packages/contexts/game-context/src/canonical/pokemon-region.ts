export const POKEMON_REGIONS = [
	"KANTO",
	"JOHTO",
	"HOENN",
	"SINNOH",
	"UNOVA",
	"KALOS",
	"ALOLA",
	"GALAR",
	"HISUI",
	"PALDEA",
	"UNREGISTERED",
] as const;

export type PokemonRegion = (typeof POKEMON_REGIONS)[number];
export namespace PokemonRegionRef {
	export function from(value: string): PokemonRegion {
		if (!(POKEMON_REGIONS as readonly string[]).includes(value)) {
			throw new Error(`Invalid PokemonRegion: ${value}`);
		}
		return value as PokemonRegion;
	}
}

export type PokemonRegional = Exclude<
	PokemonRegion,
	"JOHTO" | "HOENN" | "SINNOH" | "UNOVA" | "KALOS" | "UNREGISTERED"
>;

export const POKEMON_REGIONAL_ORIGIN_SUFFIX: Record<PokemonRegional, string> = {
	ALOLA: "ALOLA",
	GALAR: "GALARIAN",
	HISUI: "HISUIAN",
	KANTO: "KANTONIAN",
	PALDEA: "PALDEA",
} as const;

export const REGION_LABEL: Record<
	Exclude<PokemonRegion, "UNREGISTERED">,
	string
> = {
	ALOLA: "Alola",
	GALAR: "Galar",
	HISUI: "Hisui",
	HOENN: "Hoenn",
	JOHTO: "Johto",
	KALOS: "Kalos",
	KANTO: "Kanto",
	PALDEA: "Paldea",
	SINNOH: "Sinnoh",
	UNOVA: "Unova",
};
