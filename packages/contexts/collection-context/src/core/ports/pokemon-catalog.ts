// import type { PokemonRef, TypeRef } from "@context/shared";

// /**
//  * @description
//  * Describing a pokemon that can actually be tracked.
//  *
//  * Since a species could have multiple forms, where
//  * a form could be in any meaning:
//  *
//  * - Female Variant: e.g. Venusaur, Pikachu, Frilish, etc.
//  * - Regional Variant: e.g. Alolan Rattata, Hisuian Sneasel, etc.
//  * - Alternate Forms: e.g. Landorus Incarnate, Deoxys Attack Forme, etc.
//  * - Costume Forms: e.g. Pikachu Libre, Bulbasaur Fall 2019, etc.
//  * - Mega Forms: e.g. Mega Venusaur, Primal Kyogre, Mega Mewtwo X, etc.
//  *
//  * Then, a trainer is actually tracking a form-specific.
//  */
// export interface PokemonEntry {
// 	/**
// 	 * @description
// 	 * The registered number in pokedex for this specific form.
// 	 */
// 	dexNumber: number;
// 	/**
// 	 * @description
// 	 * Indicates the unique form name.
// 	 *
// 	 * @example
// 	 * - `CHARIZARD_MEGA_Y`
// 	 * - `CHARIZARD_MEGA_X`
// 	 * - `ZACIAN_CROWNED_SWORD`
// 	 * - `ZACIAN_HERO_OF_MANY_BATTLES`
// 	 */
// 	formName: string;
// 	/**
// 	 * @description
// 	 * Indicates that this pokemon is a costume form.
// 	 */
// 	isCostume: boolean;
// 	/**
// 	 * @description
// 	 * Indicates that this pokemon is a mega or primal evolution.
// 	 */
// 	isTemporaryEvolution: boolean;
// 	/**
// 	 * @description
// 	 * Unique referenced value used to distinguish one
// 	 * pokemon to another.
// 	 */
// 	ref: PokemonRef;
// 	/**
// 	 * @description
// 	 * The actual species name. Two different `TrackablePokemon`
// 	 * may have a same `speciesName`.
// 	 *
// 	 * @example
// 	 * - `PIKACHU`
// 	 * - `BULBASAUR`
// 	 * - `DIALGA`
// 	 * - `COFAGRIGUS`
// 	 */
// 	speciesName: string;
// 	/**
// 	 * @description
// 	 * The sprites containing default and shiny urls.
// 	 */
// 	sprites: {
// 		url: string | null;
// 		shinyUrl: string | null;
// 	};
// 	/**
// 	 * @description
// 	 * The elemental types of this form. A species could either
// 	 * have one primary type or two different types.
// 	 *
// 	 * @example
// 	 * - Charmender: ["FIRE"]
// 	 * - Volcanion: ["FIRE", "WATER"]
// 	 */
// 	types: [TypeRef] | [TypeRef, TypeRef];
// }

// /**
//  * @description
//  * Source for the canonical trackable pokemon.
//  */
// export interface IPokemonCatalog {
// 	exists(pokemonRef: string): Promise<boolean | null>;
// 	// findByRef(pokemonRef: string): Promise<PokemonEntry | null>;
// }
