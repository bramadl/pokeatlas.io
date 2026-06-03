import { Separator } from "@/components/ui/separator";

interface ToolbarFilterLabelProps {
	children: React.ReactNode;
	hasClear?: boolean;
	onClear?(): void;
}

export function ToolbarFilterLabel({
	children,
	hasClear,
	onClear,
}: ToolbarFilterLabelProps) {
	return (
		<div className="flex items-center gap-2 mb-2 h-3">
			<p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground/70">
				{children}
			</p>
			{hasClear && (
				<>
					<Separator orientation="vertical" />
					<button
						className="text-xs text-muted-foreground/50 hover:text-foreground transition-colors"
						onClick={onClear}
						type="button"
					>
						Clear
					</button>
				</>
			)}
		</div>
	);
}
