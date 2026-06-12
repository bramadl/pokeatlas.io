import { POKEDEX_OPTIONS as core } from "@pokepulse/core";

export const POKEDEX_OPTIONS = core.map(
	(c) => c.toLowerCase().charAt(0).toUpperCase() + c.toLowerCase().slice(1),
);
