import { cn } from "@/lib/utils";

export function FilterGroup({
	children,
	className,
}: React.ComponentProps<"div">) {
	return (
		<div className={cn("flex flex-wrap items-center gap-1", className)}>
			{children}
		</div>
	);
}
