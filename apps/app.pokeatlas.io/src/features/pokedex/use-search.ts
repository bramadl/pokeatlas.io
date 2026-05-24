"use client";

import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";

const DEBOUNCE_MS = 500;

interface UseSearchReturn {
	onSearchChange: (value: string) => void;
	search: string;
}

export function useSearch(initialSearch: string): UseSearchReturn {
	const [search, setSearch] = useState(initialSearch);
	const router = useRouter();
	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const onSearchChange = useCallback(
		(value: string) => {
			setSearch(value);

			if (debounceRef.current) clearTimeout(debounceRef.current);
			debounceRef.current = setTimeout(() => {
				const params = new URLSearchParams();
				if (value.trim()) params.set("search", value.trim());
				router.push(`/?${params.toString()}`);
			}, DEBOUNCE_MS);
		},
		[router],
	);

	return { onSearchChange, search };
}
