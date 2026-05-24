// ── Types ─────────────────────────────────────────────────────────────────────

export type PokedexStatus = "all" | "caught" | "missing";
export type PokedexForm = "all" | "mega" | "regional" | "female" | "costume";

export interface PokedexFilters {
	form: PokedexForm;
	status: PokedexStatus;
	types: string[];
}

// ── Constants ─────────────────────────────────────────────────────────────────

export const DEFAULT_FILTERS: PokedexFilters = {
	form: "all",
	status: "all",
	types: [],
};

export const FORM_OPTIONS: { label: string; value: PokedexForm }[] = [
	{ label: "All", value: "all" },
	{ label: "Mega", value: "mega" },
	{ label: "Regional", value: "regional" },
	{ label: "Female", value: "female" },
	{ label: "Costume", value: "costume" },
];

export const POKEMON_TYPES = [
	"bug",
	"dark",
	"dragon",
	"electric",
	"fairy",
	"fighting",
	"fire",
	"flying",
	"ghost",
	"grass",
	"ground",
	"ice",
	"normal",
	"poison",
	"psychic",
	"rock",
	"steel",
	"water",
] as const;

export const STATUS_OPTIONS: { label: string; value: PokedexStatus }[] = [
	{ label: "All", value: "all" },
	{ label: "Caught", value: "caught" },
	{ label: "Missing", value: "missing" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Serialize filters + search into a URLSearchParams, preserving other params. */
export function buildSearchParams(
	base: URLSearchParams,
	patch: Partial<PokedexFilters & { search: string }>,
): URLSearchParams {
	const next = new URLSearchParams(base);

	if ("search" in patch) {
		if (patch.search?.trim()) {
			next.set("search", patch.search.trim());
		} else {
			next.delete("search");
		}
	}

	if ("status" in patch) {
		if (patch.status && patch.status !== "all") {
			next.set("status", patch.status);
		} else {
			next.delete("status");
		}
	}

	if ("form" in patch) {
		if (patch.form && patch.form !== "all") {
			next.set("form", patch.form);
		} else {
			next.delete("form");
		}
	}

	if ("types" in patch) {
		next.delete("type");
		for (const t of patch.types ?? []) {
			next.append("type", t);
		}
	}

	return next;
}

/** Count how many filters are actively set (i.e. not default). */
export function countActiveFilters(filters: PokedexFilters): number {
	let count = 0;
	if (filters.status !== "all") count++;
	if (filters.form !== "all") count++;
	count += filters.types.length;
	return count;
}

/** Parse URL search params into a PokedexFilters object. */
export function parseFiltersFromParams(
	params: URLSearchParams | Record<string, string | string[] | undefined>,
): PokedexFilters {
	const get = (key: string): string | undefined => {
		if (params instanceof URLSearchParams) return params.get(key) ?? undefined;
		const v = params[key];
		return Array.isArray(v) ? v[0] : v;
	};

	const getAll = (key: string): string[] => {
		if (params instanceof URLSearchParams) return params.getAll(key);
		const v = params[key];
		if (!v) return [];
		return Array.isArray(v) ? v : [v];
	};

	const status = get("status") as PokedexStatus | undefined;
	const form = get("form") as PokedexForm | undefined;
	const types = getAll("type");

	return {
		form: FORM_OPTIONS.some((o) => o.value === form)
			? (form as PokedexForm)
			: "all",
		status: STATUS_OPTIONS.some((o) => o.value === status)
			? (status as PokedexStatus)
			: "all",
		types: types.filter((t) =>
			(POKEMON_TYPES as readonly string[]).includes(t),
		),
	};
}
