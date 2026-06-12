export const COTD_FACTORS = [
	{
		desc: "Pokémon that would push a collection (e.g. your Shiny Dex) closest to 100%.",
		name: "Nearest Completion",
	},
	{
		desc: "Your most-progressed collection — catching these keeps your momentum going.",
		name: "Strongest Collection",
	},
	{
		desc: "Missing Pokémon from the tracking states you've focused on most.",
		name: "Opportunity",
	},
	{
		desc: "A deterministic seed based on your Trainer ID + today's date. The list is consistent all day, but changes tomorrow.",
		name: "Daily Seed",
	},
] as const;
