/**
 * @description
 * Defines the status options for a Pokedex filter.
 */
export type PokedexStatus = (typeof POKEDEX_STATUSES)[number];
export const POKEDEX_STATUSES = ["MISSING", "TRACKED"] as const;
