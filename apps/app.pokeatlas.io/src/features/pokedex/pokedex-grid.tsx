"use client";

import { useEffect, useState } from "react";
import { useIsMounted } from "usehooks-ts";
import { cn } from "@/lib/utils";

export function PokedexGrid({
	children,
	isLoading,
}: {
	children: React.ReactNode;
	isLoading?: boolean;
}) {
	const [loaded, setLoaded] = useState(false);

	const isMounted = useIsMounted();
	useEffect(() => {
		if (isMounted()) setLoaded(true);
	}, [isMounted]);

	return (
		<div
			className={cn(
				"min-h-160 lg:min-h-120",
				isLoading && "animate-pulse duration-300",
				!loaded && "pointer-events-none",
			)}
		>
			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-4 items-start px-4 py-6 md:py-8">
				{children}
			</div>
		</div>
	);
}
