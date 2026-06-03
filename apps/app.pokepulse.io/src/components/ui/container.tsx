import { cn } from "@/lib/utils";

interface ContainerProps extends React.ComponentProps<"div"> {
	padded?: boolean;
}

export function Container({
	className,
	children,
	padded = false,
	...props
}: ContainerProps) {
	return (
		<div
			className={cn(
				"md:max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto",
				padded && "px-4 lg:px-0",
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
}
