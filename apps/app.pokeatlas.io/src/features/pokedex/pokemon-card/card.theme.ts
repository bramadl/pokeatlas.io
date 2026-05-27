import type { PokemonType } from "./card.constants";

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
		cardBg: "from-lime-100",
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
		badgeBg: "bg-mauve-100",
		badgeBorder: "border-mauve-400",
		badgeText: "text-mauve-700",
		cardBg: "from-mauve-300",
		hoverBg: "group-hover:from-mauve-200",
	},
	electric: {
		badgeBg: "bg-yellow-100",
		badgeBorder: "border-yellow-400",
		badgeText: "text-yellow-700",
		cardBg: "from-yellow-100",
		hoverBg: "group-hover:from-yellow-200",
	},
	fairy: {
		badgeBg: "bg-purple-100",
		badgeBorder: "border-purple-400",
		badgeText: "text-purple-700",
		cardBg: "from-purple-100",
		hoverBg: "group-hover:from-purple-200",
	},
	fighting: {
		badgeBg: "bg-rose-100",
		badgeBorder: "border-rose-400",
		badgeText: "text-rose-700",
		cardBg: "from-rose-100",
		hoverBg: "group-hover:from-rose-200",
	},
	fire: {
		badgeBg: "bg-red-100",
		badgeBorder: "border-red-400",
		badgeText: "text-red-700",
		cardBg: "from-red-100",
		hoverBg: "group-hover:from-red-200",
	},
	flying: {
		badgeBg: "bg-sky-100",
		badgeBorder: "border-sky-400",
		badgeText: "text-sky-700",
		cardBg: "from-sky-100",
		hoverBg: "group-hover:from-sky-200",
	},
	ghost: {
		badgeBg: "bg-violet-100",
		badgeBorder: "border-violet-400",
		badgeText: "text-violet-700",
		cardBg: "from-violet-100",
		hoverBg: "group-hover:from-violet-200",
	},
	grass: {
		badgeBg: "bg-green-100",
		badgeBorder: "border-green-400",
		badgeText: "text-green-700",
		cardBg: "from-green-100",
		hoverBg: "group-hover:from-green-300",
	},
	ground: {
		badgeBg: "bg-amber-100",
		badgeBorder: "border-amber-400",
		badgeText: "text-amber-700",
		cardBg: "from-amber-100",
		hoverBg: "group-hover:from-amber-200",
	},
	ice: {
		badgeBg: "bg-teal-100",
		badgeBorder: "border-teal-400",
		badgeText: "text-teal-700",
		cardBg: "from-teal-100",
		hoverBg: "group-hover:from-teal-200",
	},
	normal: {
		badgeBg: "bg-taupe-100",
		badgeBorder: "border-taupe-400",
		badgeText: "text-taupe-700",
		cardBg: "from-taupe-300",
		hoverBg: "group-hover:from-taupe-200",
	},
	poison: {
		badgeBg: "bg-pink-100",
		badgeBorder: "border-pink-400",
		badgeText: "text-pink-700",
		cardBg: "from-pink-100",
		hoverBg: "group-hover:from-pink-200",
	},
	psychic: {
		badgeBg: "bg-fuchsia-100",
		badgeBorder: "border-fuchsia-400",
		badgeText: "text-fuchsia-700",
		cardBg: "from-fuchsia-100",
		hoverBg: "group-hover:from-fuchsia-200",
	},
	rock: {
		badgeBg: "bg-orange-100",
		badgeBorder: "border-orange-400",
		badgeText: "text-orange-700",
		cardBg: "from-orange-100",
		hoverBg: "group-hover:from-orange-200",
	},
	steel: {
		badgeBg: "bg-zinc-100",
		badgeBorder: "border-zinc-400",
		badgeText: "text-zinc-700",
		cardBg: "from-zinc-100",
		hoverBg: "group-hover:from-zinc-200",
	},
	water: {
		badgeBg: "bg-blue-100",
		badgeBorder: "border-blue-400",
		badgeText: "text-blue-700",
		cardBg: "from-blue-100",
		hoverBg: "group-hover:from-blue-200",
	},
};
