import { useQueryState } from "nuqs";

import { variantsParser } from "../filter.params";
import {
	getInitialVariants,
	VARIANT_DEFINITIONS,
	VARIANTS_BY_KEY,
	type VariantKey,
	writeStored,
} from "./variant.store";

export function useVariantControlsStore() {
	const [variants, setVariants] = useQueryState(
		"variants",
		variantsParser.withDefault(getInitialVariants()),
	);

	const variantSet = new Set(variants);

	const values = Object.fromEntries(
		VARIANT_DEFINITIONS.map((v) => [v.key, variantSet.has(v.urlValue)]),
	) as Record<VariantKey, boolean>;

	function toggle(key: VariantKey) {
		const { urlValue } = VARIANTS_BY_KEY[key];
		const next = !values[key];
		writeStored(key, next);
		setVariants(
			next
				? [...variantSet, urlValue]
				: [...variantSet].filter((v) => v !== urlValue),
		);
	}

	const activeCount = VARIANT_DEFINITIONS.filter((v) => values[v.key]).length;

	return { activeCount, toggle, values };
}
