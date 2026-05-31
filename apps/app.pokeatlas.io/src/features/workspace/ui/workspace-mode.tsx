import { Button } from "@/components/ui/button";

import { BRUSH_META, POINTER_META } from "../brush";
import { useWorkspace } from "../use-workspace";

export function WorkspaceMode() {
	const { activeBrushes } = useWorkspace();

	const label =
		activeBrushes.length === 0
			? POINTER_META.label
			: activeBrushes.map((b) => BRUSH_META[b].label).join(" ");

	return (
		<Button variant="secondary">
			Mode: <strong>{label}</strong>
		</Button>
	);
}
