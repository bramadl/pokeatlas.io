"use client";

import { useRouter } from "@bprogress/next/app";
import { useSearchParams } from "next/navigation";
import { useCallback, useRef, useState, useTransition } from "react";

import { buildSearchParams } from "../filter-tool/filter.types";

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
	const searchParams = useSearchParams();

	const onSearchChange = useCallback(
		(value: string) => {
			setSearch(value);

			if (debounceRef.current) clearTimeout(debounceRef.current);
			debounceRef.current = setTimeout(() => {
				const next = buildSearchParams(searchParams, { search: value });
				startTransition(() => void router.push(`/?${next.toString()}`));
			}, DEBOUNCE_MS);
		},
		[router, searchParams],
	);

	return {
		isSearchPending: isNavigating,
		onSearchChange,
		search,
	};
}
