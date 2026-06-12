import type { BuddyOption } from "../sections/buddy.section";
import type { ReelEntry } from "./highlight-reels";

// ---------------------------------------------------------------------------
// Mock data — replace with real API calls when BE is ready
// These will be driven by browsePokedex({ filters: { status: "TRACKED" } })
// ---------------------------------------------------------------------------

export const MOCK_BUDDY_OPTIONS: BuddyOption[] = [
	{
		id: "dragonite",
		name: "Dragonite",
		spriteUrl:
			"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/149.png",
	},
	{
		id: "gengar",
		name: "Gengar",
		spriteUrl:
			"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png",
	},
	{
		id: "mewtwo",
		name: "Mewtwo",
		spriteUrl:
			"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png",
	},
	{
		id: "gyarados",
		name: "Gyarados",
		spriteUrl:
			"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/130.png",
	},
	{
		id: "snorlax",
		name: "Snorlax",
		spriteUrl:
			"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/143.png",
	},
	{
		id: "pikachu",
		name: "Pikachu",
		spriteUrl:
			"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
	},
];

export const MOCK_REEL_ENTRIES: ReelEntry[] = [
	{
		id: "dragonite",
		name: "Dragonite",
		spriteUrl:
			"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/149.png",
	},
	{
		id: "gengar",
		name: "Gengar",
		spriteUrl:
			"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png",
	},
	{
		id: "mewtwo",
		name: "Mewtwo",
		spriteUrl:
			"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png",
	},
	{
		id: "snorlax",
		name: "Snorlax",
		spriteUrl:
			"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/143.png",
	},
	{
		id: "gyarados",
		name: "Gyarados",
		spriteUrl:
			"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/130.png",
	},
	{
		id: "pikachu",
		name: "Pikachu",
		spriteUrl:
			"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
	},
	{
		id: "lapras",
		name: "Lapras",
		spriteUrl:
			"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/131.png",
	},
	{
		id: "vaporeon",
		name: "Vaporeon",
		spriteUrl:
			"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/134.png",
	},
];
