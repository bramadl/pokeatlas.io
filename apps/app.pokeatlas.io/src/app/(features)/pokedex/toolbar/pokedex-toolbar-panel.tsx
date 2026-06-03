import { ClassificationsFilter } from "./filters/classifications-filter";
import { TypesFilter } from "./filters/types-filter";

export function PokedexToolbarPanel() {
	return (
		<div className="bg-background border-t">
			<div className="p-4 grid lg:grid-cols-[300px_1fr_300px] xl:grid-cols-[320px_1fr_320px] gap-x-8 gap-y-4">
				<div>
					<ClassificationsFilter />
				</div>
				<div className="lg:col-span-2">
					<TypesFilter />
				</div>
			</div>
		</div>
	);
}
