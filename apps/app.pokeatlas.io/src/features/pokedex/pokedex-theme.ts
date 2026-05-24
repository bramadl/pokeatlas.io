// ── Pokemon Type Theme ────────────────────────────────────────────────────────
//
// Single source of truth for all Tailwind color classes tied to a Pokémon type.
// Previously scattered across four separate lookup maps in pokedex-card.tsx.

export interface TypeTheme {
	/** Tracked state badge background */
	badgeBg: string;
	/** Tracked state badge border */
	badgeBorder: string;
	/** Tracked state badge text */
	badgeText: string;
	/** Sprite bubble background gradient (idle) */
	gradient: string;
	/** Card background gradient on hover (untracked state) */
	hoverBg: string;
	/** Card background gradient (tracked state) */
	trackedBg: string;
	/** Ring color (tracked state) */
	trackedRing: string;
}

export const TYPE_THEME = {
	bug: {
		badgeBg: "bg-lime-100",
		badgeBorder: "border-lime-400",
		badgeText: "text-lime-700",
		gradient: "from-lime-100",
		hoverBg: "group-hover:from-lime-50",
		trackedBg: "from-lime-50",
		trackedRing: "ring-lime-500/10",
	},
	dark: {
		badgeBg: "bg-stone-200",
		badgeBorder: "border-stone-400",
		badgeText: "text-stone-700",
		gradient: "from-stone-300",
		hoverBg: "group-hover:from-stone-200",
		trackedBg: "from-stone-200",
		trackedRing: "ring-stone-200/10",
	},
	dragon: {
		badgeBg: "bg-slate-200",
		badgeBorder: "border-slate-400",
		badgeText: "text-slate-700",
		gradient: "from-slate-300",
		hoverBg: "group-hover:from-slate-200",
		trackedBg: "from-slate-200",
		trackedRing: "ring-slate-200/10",
	},
	electric: {
		badgeBg: "bg-yellow-100",
		badgeBorder: "border-yellow-400",
		badgeText: "text-yellow-700",
		gradient: "from-yellow-100",
		hoverBg: "group-hover:from-yellow-50",
		trackedBg: "from-yellow-50",
		trackedRing: "ring-yellow-500/10",
	},
	fairy: {
		badgeBg: "bg-purple-100",
		badgeBorder: "border-purple-400",
		badgeText: "text-purple-700",
		gradient: "from-purple-100",
		hoverBg: "group-hover:from-purple-50",
		trackedBg: "from-purple-50",
		trackedRing: "ring-purple-500/10",
	},
	fighting: {
		badgeBg: "bg-rose-100",
		badgeBorder: "border-rose-400",
		badgeText: "text-rose-700",
		gradient: "from-rose-100",
		hoverBg: "group-hover:from-rose-50",
		trackedBg: "from-rose-50",
		trackedRing: "ring-rose-500/10",
	},
	fire: {
		badgeBg: "bg-red-100",
		badgeBorder: "border-red-400",
		badgeText: "text-red-700",
		gradient: "from-red-100",
		hoverBg: "group-hover:from-red-50",
		trackedBg: "from-red-50",
		trackedRing: "ring-red-500/10",
	},
	flying: {
		badgeBg: "bg-sky-100",
		badgeBorder: "border-sky-400",
		badgeText: "text-sky-700",
		gradient: "from-sky-100",
		hoverBg: "group-hover:from-sky-50",
		trackedBg: "from-sky-50",
		trackedRing: "ring-sky-500/10",
	},
	ghost: {
		badgeBg: "bg-violet-100",
		badgeBorder: "border-violet-400",
		badgeText: "text-violet-700",
		gradient: "from-violet-100",
		hoverBg: "group-hover:from-violet-50",
		trackedBg: "from-violet-50",
		trackedRing: "ring-violet-500/10",
	},
	grass: {
		badgeBg: "bg-green-100",
		badgeBorder: "border-green-400",
		badgeText: "text-green-700",
		gradient: "from-green-100",
		hoverBg: "group-hover:from-green-50",
		trackedBg: "from-green-50",
		trackedRing: "ring-green-500/10",
	},
	ground: {
		badgeBg: "bg-amber-100",
		badgeBorder: "border-amber-400",
		badgeText: "text-amber-700",
		gradient: "from-amber-100",
		hoverBg: "group-hover:from-amber-50",
		trackedBg: "from-amber-50",
		trackedRing: "ring-amber-500/10",
	},
	ice: {
		badgeBg: "bg-teal-100",
		badgeBorder: "border-teal-400",
		badgeText: "text-teal-700",
		gradient: "from-teal-100",
		hoverBg: "group-hover:from-teal-50",
		trackedBg: "from-teal-50",
		trackedRing: "ring-teal-500/10",
	},
	normal: {
		badgeBg: "bg-gray-200",
		badgeBorder: "border-gray-400",
		badgeText: "text-gray-700",
		gradient: "from-gray-300",
		hoverBg: "group-hover:from-gray-200",
		trackedBg: "from-gray-200",
		trackedRing: "ring-gray-200/50",
	},
	poison: {
		badgeBg: "bg-pink-100",
		badgeBorder: "border-pink-400",
		badgeText: "text-pink-700",
		gradient: "from-pink-100",
		hoverBg: "group-hover:from-pink-50",
		trackedBg: "from-pink-50",
		trackedRing: "ring-pink-500/10",
	},
	psychic: {
		badgeBg: "bg-fuchsia-100",
		badgeBorder: "border-fuchsia-400",
		badgeText: "text-fuchsia-700",
		gradient: "from-fuchsia-100",
		hoverBg: "group-hover:from-fuchsia-50",
		trackedBg: "from-fuchsia-50",
		trackedRing: "ring-fuchsia-500/10",
	},
	rock: {
		badgeBg: "bg-orange-100",
		badgeBorder: "border-orange-400",
		badgeText: "text-orange-700",
		gradient: "from-orange-100",
		hoverBg: "group-hover:from-orange-50",
		trackedBg: "from-orange-50",
		trackedRing: "ring-orange-500/10",
	},
	steel: {
		badgeBg: "bg-zinc-100",
		badgeBorder: "border-zinc-400",
		badgeText: "text-zinc-700",
		gradient: "from-zinc-100",
		hoverBg: "group-hover:from-zinc-50",
		trackedBg: "from-zinc-50",
		trackedRing: "ring-zinc-500/10",
	},
	water: {
		badgeBg: "bg-blue-100",
		badgeBorder: "border-blue-400",
		badgeText: "text-blue-700",
		gradient: "from-blue-100",
		hoverBg: "group-hover:from-blue-50",
		trackedBg: "from-blue-50",
		trackedRing: "ring-blue-500/10",
	},
} as const satisfies Record<string, TypeTheme>;

export type PokemonType = keyof typeof TYPE_THEME;

/** Falls back gracefully to `normal` for unknown types */
export function getTypeTheme(type: string): TypeTheme {
	return TYPE_THEME[type.toLowerCase() as PokemonType] ?? TYPE_THEME.normal;
}
