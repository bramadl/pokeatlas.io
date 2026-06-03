import { Commet } from "react-loading-indicators";

export function PokedexLoading() {
	return (
		<div className="min-h-160 md:min-h-120 col-span-full flex flex-col items-center justify-center gap-4 text-center">
			<Commet color="var(--primary)" size="medium" text="" textColor="" />
		</div>
	);
}
