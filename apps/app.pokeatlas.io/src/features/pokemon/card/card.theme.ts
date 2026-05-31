import type { PokemonType } from "../../global/definitions/pokemon-types";

export interface PokemonTheme {
	badgeBg: string;
	badgeBorder: string;
	badgeText: string;
	cardBg: string;
	hoverBg: string;
}

export const POKEMON_THEME_MAP: Record<PokemonType, PokemonTheme> = {
	bug: {
		badgeBg: "bg-lime-100",
		badgeBorder: "border-lime-400",
		badgeText: "text-lime-700",
		cardBg: "from-lime-200",
		hoverBg: "group-hover:from-lime-200",
	},

	dark: {
		badgeBg: "bg-zinc-100",
		badgeBorder: "border-zinc-400",
		badgeText: "text-zinc-700",
		cardBg: "from-zinc-400",
		hoverBg: "group-hover:from-zinc-200",
	},

	dragon: {
		badgeBg: "bg-indigo-100",
		badgeBorder: "border-indigo-400",
		badgeText: "text-indigo-700",
		cardBg: "from-indigo-200",
		hoverBg: "group-hover:from-indigo-300",
	},

	electric: {
		badgeBg: "bg-yellow-100",
		badgeBorder: "border-yellow-400",
		badgeText: "text-yellow-700",
		cardBg: "from-yellow-200",
		hoverBg: "group-hover:from-yellow-200",
	},

	fairy: {
		badgeBg: "bg-pink-100",
		badgeBorder: "border-pink-400",
		badgeText: "text-pink-700",
		cardBg: "from-pink-200",
		hoverBg: "group-hover:from-pink-200",
	},

	fighting: {
		badgeBg: "bg-red-100",
		badgeBorder: "border-red-400",
		badgeText: "text-red-700",
		cardBg: "from-red-200",
		hoverBg: "group-hover:from-red-200",
	},

	fire: {
		badgeBg: "bg-orange-100",
		badgeBorder: "border-orange-400",
		badgeText: "text-orange-700",
		cardBg: "from-orange-200",
		hoverBg: "group-hover:from-orange-200",
	},

	flying: {
		badgeBg: "bg-sky-100",
		badgeBorder: "border-sky-400",
		badgeText: "text-sky-700",
		cardBg: "from-sky-200",
		hoverBg: "group-hover:from-sky-200",
	},

	ghost: {
		badgeBg: "bg-violet-100",
		badgeBorder: "border-violet-400",
		badgeText: "text-violet-700",
		cardBg: "from-violet-200",
		hoverBg: "group-hover:from-violet-200",
	},

	grass: {
		badgeBg: "bg-green-100",
		badgeBorder: "border-green-400",
		badgeText: "text-green-700",
		cardBg: "from-green-200",
		hoverBg: "group-hover:from-green-200",
	},

	ground: {
		badgeBg: "bg-orange-100",
		badgeBorder: "border-orange-400",
		badgeText: "text-orange-700",
		cardBg: "from-orange-200",
		hoverBg: "group-hover:from-orange-300",
	},

	ice: {
		badgeBg: "bg-cyan-100",
		badgeBorder: "border-cyan-400",
		badgeText: "text-cyan-700",
		cardBg: "from-cyan-200",
		hoverBg: "group-hover:from-cyan-200",
	},

	normal: {
		badgeBg: "bg-neutral-100",
		badgeBorder: "border-neutral-400",
		badgeText: "text-neutral-700",
		cardBg: "from-neutral-200",
		hoverBg: "group-hover:from-neutral-300",
	},

	poison: {
		badgeBg: "bg-purple-100",
		badgeBorder: "border-purple-400",
		badgeText: "text-purple-700",
		cardBg: "from-purple-200",
		hoverBg: "group-hover:from-purple-200",
	},

	psychic: {
		badgeBg: "bg-fuchsia-100",
		badgeBorder: "border-fuchsia-400",
		badgeText: "text-fuchsia-700",
		cardBg: "from-fuchsia-200",
		hoverBg: "group-hover:from-fuchsia-200",
	},

	rock: {
		badgeBg: "bg-amber-100",
		badgeBorder: "border-amber-400",
		badgeText: "text-amber-700",
		cardBg: "from-amber-400",
		hoverBg: "group-hover:from-amber-200",
	},

	steel: {
		badgeBg: "bg-zinc-100",
		badgeBorder: "border-zinc-400",
		badgeText: "text-zinc-700",
		cardBg: "from-zinc-400",
		hoverBg: "group-hover:from-zinc-300",
	},

	water: {
		badgeBg: "bg-blue-100",
		badgeBorder: "border-blue-400",
		badgeText: "text-blue-700",
		cardBg: "from-blue-200",
		hoverBg: "group-hover:from-blue-200",
	},
};
