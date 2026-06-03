import { createParser, parseAsArrayOf, parseAsString } from "nuqs/server";

export function createSearchParser() {
	return parseAsString.withOptions({ history: "push" });
}

export function createSingleSelectParser<T extends string>(
	options: readonly T[],
	aliases?: Partial<Record<T, string>>,
) {
	const reverseAliases = aliases
		? (Object.fromEntries(
				Object.entries(aliases).map(([k, v]) => [v as string, k as T]),
			) as Record<string, T>)
		: null;

	return createParser<T>({
		parse: (value) => {
			if (reverseAliases) {
				const fromAlias = reverseAliases[value.toLowerCase()];
				if (fromAlias && options.includes(fromAlias)) return fromAlias;
			}

			const target = value.toUpperCase() as T;
			return options.includes(target) ? target : null;
		},
		serialize: (value) => {
			if (aliases?.[value]) return aliases[value];
			return value.toLowerCase();
		},
	}).withOptions({ history: "push" });
}

export function createMultiSelectParser<T extends string>(
	options?: readonly T[],
	aliases?: Partial<Record<T, string>>,
) {
	const reverseAliases = aliases
		? (Object.fromEntries(
				Object.entries(aliases).map(([k, v]) => [v as string, k as T]),
			) as Record<string, T>)
		: null;

	const itemParser = createParser<T>({
		parse: (value) => {
			if (reverseAliases) {
				const fromAlias = reverseAliases[value.toLowerCase()];
				if (fromAlias) {
					if (options && !options.includes(fromAlias)) return null;
					return fromAlias;
				}
			}

			const target = value.toUpperCase() as T;
			if (options && !options.includes(target)) return null;
			return target;
		},
		serialize: (value) => {
			if (aliases?.[value]) return aliases[value];
			return value.toLowerCase();
		},
	});

	const base = parseAsArrayOf(itemParser, ",").withOptions({ history: "push" });

	return {
		...base,
		withLimit(limit: number) {
			return {
				...base,
				parse: (value: string) => {
					const result = base.parse(value);
					return Array.isArray(result) ? result.slice(0, limit) : result;
				},
			};
		},
	};
}

export function createVariantParser<T extends string>(
	options: readonly { key: T; urlValue: string }[],
) {
	return createParser<Record<T, boolean>>({
		parse: (value) => {
			const values = value.split(",");
			const result = {} as Record<T, boolean>;
			options.forEach((opt) => {
				result[opt.key] = values.includes(opt.urlValue);
			});
			return result;
		},
		serialize: (value) => {
			return options
				.filter((opt) => value[opt.key])
				.map((opt) => opt.urlValue)
				.join(",");
		},
	}).withOptions({ history: "push" });
}
