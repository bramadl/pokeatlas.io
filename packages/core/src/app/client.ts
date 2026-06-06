import type { CollectionContext } from "@context/collection";
import type { ProgressContext } from "@context/progress";

export interface PokePulseDeps {
	collection: CollectionContext;
	progress: ProgressContext;
}

export class PokePulse {
	public readonly collection: CollectionContext;

	public readonly progress: ProgressContext;

	constructor(deps: PokePulseDeps) {
		this.collection = deps.collection;
		this.progress = deps.progress;
	}
}
