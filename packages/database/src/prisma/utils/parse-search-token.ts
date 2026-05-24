interface SearchToken {
	type: "name" | "dex" | "family";
	value: string;
}

export function parseSearchTokens(search: string): SearchToken[] {
	return search
		.split(",")
		.map((t) => t.trim())
		.filter(Boolean)
		.map((term) => {
			if (term.startsWith("+")) {
				return { type: "family", value: term.slice(1).trim() };
			}
			const asNumber = parseInt(term, 10);
			if (!Number.isNaN(asNumber)) {
				return { type: "dex", value: term };
			}
			return { type: "name", value: term };
		});
}
