import { BrushToolbar } from "./brush-toolbar";
import { RefreshButton } from "./refresh-button";

export function WorkspaceBar() {
	return (
		<aside className="fixed z-10 bottom-10 left-1/2 -translate-x-1/2 min-w-64 rounded-full bg-background text-foreground drop-shadow-2xl border border-border/50">
			<div className="flex items-center gap-4 p-3 px-5">
				<RefreshButton />
				<BrushToolbar />
			</div>
		</aside>
	);
}
