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
	/** @deprecated Border color (hover, untracked, inspector state) */
	tintedBorder: string;
	/** Card background gradient (tracked state) */
	trackedBg: string;
	/** @deprecated Border color (tracked state) */
	trackedBorder: string;
	/** @deprecated Ring color (tracked state) */
	trackedRing: string;
}

export const TYPE_THEME = {
	bug: {
		badgeBg: "bg-lime-100",
		badgeBorder: "border-lime-400",
		badgeText: "text-lime-700",
		gradient: "from-lime-100",
		hoverBg: "from-lime-100",
		tintedBorder: "hover:border-lime-300/50",
		trackedBg: "from-lime-200",
		trackedBorder: "border-lime-300",
		trackedRing: "ring-lime-300/25",
	},
	dark: {
		badgeBg: "bg-gray-100",
		badgeBorder: "border-gray-400",
		badgeText: "text-gray-700",
		gradient: "from-gray-100",
		hoverBg: "from-gray-200",
		tintedBorder: "hover:border-gray-300/50",
		trackedBg: "from-gray-200",
		trackedBorder: "border-gray-300",
		trackedRing: "ring-gray-300/25",
	},
	dragon: {
		badgeBg: "bg-slate-100",
		badgeBorder: "border-slate-400",
		badgeText: "text-slate-700",
		gradient: "from-slate-100",
		hoverBg: "from-slate-100",
		tintedBorder: "hover:border-slate-300/50",
		trackedBg: "from-slate-200",
		trackedBorder: "border-slate-300",
		trackedRing: "ring-slate-300/25",
	},
	electric: {
		badgeBg: "bg-yellow-100",
		badgeBorder: "border-yellow-400",
		badgeText: "text-yellow-700",
		gradient: "from-yellow-100",
		hoverBg: "from-yellow-100",
		tintedBorder: "hover:border-yellow-300/50",
		trackedBg: "from-yellow-200",
		trackedBorder: "border-yellow-300",
		trackedRing: "ring-yellow-300/25",
	},
	fairy: {
		badgeBg: "bg-purple-100",
		badgeBorder: "border-purple-400",
		badgeText: "text-purple-700",
		gradient: "from-purple-100",
		hoverBg: "from-purple-100",
		tintedBorder: "hover:border-purple-300/50",
		trackedBg: "from-purple-200",
		trackedBorder: "border-purple-300",
		trackedRing: "ring-purple-300/25",
	},
	fighting: {
		badgeBg: "bg-rose-100",
		badgeBorder: "border-rose-400",
		badgeText: "text-rose-700",
		gradient: "from-rose-100",
		hoverBg: "from-rose-100",
		tintedBorder: "hover:border-rose-300/50",
		trackedBg: "from-rose-200",
		trackedBorder: "border-rose-300",
		trackedRing: "ring-rose-300/25",
	},
	fire: {
		badgeBg: "bg-red-100",
		badgeBorder: "border-red-400",
		badgeText: "text-red-700",
		gradient: "from-red-100",
		hoverBg: "from-red-100",
		tintedBorder: "hover:border-red-300/50",
		trackedBg: "from-red-200",
		trackedBorder: "border-red-300",
		trackedRing: "ring-red-300/25",
	},
	flying: {
		badgeBg: "bg-sky-100",
		badgeBorder: "border-sky-400",
		badgeText: "text-sky-700",
		gradient: "from-sky-100",
		hoverBg: "from-sky-100",
		tintedBorder: "hover:border-sky-300/50",
		trackedBg: "from-sky-200",
		trackedBorder: "border-sky-300",
		trackedRing: "ring-sky-300/25",
	},
	ghost: {
		badgeBg: "bg-violet-100",
		badgeBorder: "border-violet-400",
		badgeText: "text-violet-700",
		gradient: "from-violet-100",
		hoverBg: "from-violet-100",
		tintedBorder: "hover:border-violet-300/50",
		trackedBg: "from-violet-200",
		trackedBorder: "border-violet-300",
		trackedRing: "ring-violet-300/25",
	},
	grass: {
		badgeBg: "bg-green-100",
		badgeBorder: "border-green-400",
		badgeText: "text-green-700",
		gradient: "from-green-100",
		hoverBg: "from-green-100",
		tintedBorder: "hover:border-green-300/50",
		trackedBg: "from-green-200",
		trackedBorder: "border-green-300",
		trackedRing: "ring-green-300/25",
	},
	ground: {
		badgeBg: "bg-amber-100",
		badgeBorder: "border-amber-400",
		badgeText: "text-amber-700",
		gradient: "from-amber-100",
		hoverBg: "from-amber-100",
		tintedBorder: "hover:border-amber-300/50",
		trackedBg: "from-amber-200",
		trackedBorder: "border-amber-300",
		trackedRing: "ring-amber-300/25",
	},
	ice: {
		badgeBg: "bg-teal-100",
		badgeBorder: "border-teal-400",
		badgeText: "text-teal-700",
		gradient: "from-teal-100",
		hoverBg: "from-teal-100",
		tintedBorder: "hover:border-teal-300/50",
		trackedBg: "from-teal-200",
		trackedBorder: "border-teal-300",
		trackedRing: "ring-teal-300/25",
	},
	normal: {
		badgeBg: "bg-neutral-100",
		badgeBorder: "border-neutral-400",
		badgeText: "text-neutral-700",
		gradient: "from-neutral-100",
		hoverBg: "from-neutral-200",
		tintedBorder: "hover:border-neutral-300/50",
		trackedBg: "from-neutral-200",
		trackedBorder: "border-neutral-300",
		trackedRing: "ring-neutral-300/50",
	},
	poison: {
		badgeBg: "bg-pink-100",
		badgeBorder: "border-pink-400",
		badgeText: "text-pink-700",
		gradient: "from-pink-100",
		hoverBg: "from-pink-100",
		tintedBorder: "hover:border-pink-300/50",
		trackedBg: "from-pink-200",
		trackedBorder: "border-pink-300",
		trackedRing: "ring-pink-300/25",
	},
	psychic: {
		badgeBg: "bg-fuchsia-100",
		badgeBorder: "border-fuchsia-400",
		badgeText: "text-fuchsia-700",
		gradient: "from-fuchsia-100",
		hoverBg: "from-fuchsia-100",
		tintedBorder: "hover:border-fuchsia-300/50",
		trackedBg: "from-fuchsia-200",
		trackedBorder: "border-fuchsia-300",
		trackedRing: "ring-fuchsia-300/25",
	},
	rock: {
		badgeBg: "bg-orange-100",
		badgeBorder: "border-orange-400",
		badgeText: "text-orange-700",
		gradient: "from-orange-100",
		hoverBg: "from-orange-100",
		tintedBorder: "hover:border-orange-300/50",
		trackedBg: "from-orange-200",
		trackedBorder: "border-orange-300",
		trackedRing: "ring-orange-300/25",
	},
	steel: {
		badgeBg: "bg-zinc-100",
		badgeBorder: "border-zinc-400",
		badgeText: "text-zinc-700",
		gradient: "from-zinc-100",
		hoverBg: "from-zinc-100",
		tintedBorder: "hover:border-zinc-300/50",
		trackedBg: "from-zinc-200",
		trackedBorder: "border-zinc-300",
		trackedRing: "ring-zinc-300/25",
	},
	water: {
		badgeBg: "bg-blue-100",
		badgeBorder: "border-blue-400",
		badgeText: "text-blue-700",
		gradient: "from-blue-100",
		hoverBg: "from-blue-100",
		tintedBorder: "hover:border-blue-300/50",
		trackedBg: "from-blue-200",
		trackedBorder: "border-blue-300",
		trackedRing: "ring-blue-300/25",
	},
} as const satisfies Record<string, TypeTheme>;

export type PokemonType = keyof typeof TYPE_THEME;

/** Falls back gracefully to `normal` for unknown types */
export function getTypeTheme(type: string): TypeTheme {
	return TYPE_THEME[type.toLowerCase() as PokemonType] ?? TYPE_THEME.normal;
}
