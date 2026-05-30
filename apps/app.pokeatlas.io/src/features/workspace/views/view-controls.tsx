import { CaretDownIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

export function ViewControls() {
	return (
		<Button variant="secondary">
			<strong>Mode:</strong> Base View
			<CaretDownIcon />
		</Button>
	);
}
