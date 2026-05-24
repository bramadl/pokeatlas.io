"use client";

import { useRouter } from "next/navigation";
import { useCallback, useRef, useState, useTransition } from "react";

const DEBOUNCE_MS = 500;

interface UseSearchReturn {
	isSearchPending: boolean;
	onSearchChange: (value: string) => void;
	search: string;
}

export function useSearch(initialSearch: string): UseSearchReturn {
	const [isNavigating, startTransition] = useTransition();
	const [search, setSearch] = useState(initialSearch);

	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const router = useRouter();

	const onSearchChange = useCallback(
		(value: string) => {
			setSearch(value);

			if (debounceRef.current) clearTimeout(debounceRef.current);
			debounceRef.current = setTimeout(() => {
				const params = new URLSearchParams();
				if (value.trim()) params.set("search", value.trim());
				startTransition(() => {
					router.push(`/?${params.toString()}`);
				});
			}, DEBOUNCE_MS);
		},
		[router],
	);

	return {
		isSearchPending: isNavigating,
		onSearchChange,
		search,
	};
}
