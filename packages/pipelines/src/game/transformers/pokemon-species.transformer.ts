// import type {
// 	ExtractedSources,
// 	TransformedPokemonSpecies,
// } from "../types/contract.types";
// import { toTitleCase } from "../utils/string";

// export const SPECIES_REGEX = /^V(\d{4})_POKEMON_([A-Z0-9_]+)$/;

// const POKEMON_CLASS_MAP: Record<
// 	string,
// 	"LEGENDARY" | "MYTHIC" | "ULTRA_BEAST"
// > = {
// 	POKEMON_CLASS_LEGENDARY: "LEGENDARY",
// 	POKEMON_CLASS_MYTHIC: "MYTHIC",
// 	POKEMON_CLASS_ULTRA_BEAST: "ULTRA_BEAST",
// };

// export function transformSpecies(
// 	sources: ExtractedSources,
// ): TransformedPokemonSpecies[] {
// 	const species = new Map<string, TransformedPokemonSpecies>();

// 	for (const entry of sources.gameMaster) {
// 		const settings = entry.data.pokemonSettings;
// 		if (!settings?.form) continue;

// 		if (species.has(settings.pokemonId)) continue;

// 		const match = SPECIES_REGEX.exec(entry.templateId);
// 		if (!match) continue;

// 		const pokedexNumber = Number.parseInt(match[1] as string, 10);
// 		const name =
// 			sources.i18n.get(
// 				`pokemon_name_${String(pokedexNumber).padStart(4, "0")}`,
// 			) ?? toTitleCase(settings.pokemonId);

// 		species.set(settings.pokemonId, {
// 			familyId: settings.familyId,
// 			isShadowAvailable: !!settings.shadow,
// 			name,
// 			pokedexNumber,
// 			pokemonClassification: settings.pokemonClass
// 				? (POKEMON_CLASS_MAP[settings.pokemonClass] ?? null)
// 				: null,
// 			pokemonId: settings.pokemonId,
// 		});
// 	}

// 	return Array.from(species.values());
// }
