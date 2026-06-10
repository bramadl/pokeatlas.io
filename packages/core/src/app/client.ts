import type { AuthContext } from "@context/auth";
import type { CollectionContext } from "@context/collection";
import type { ProgressContext } from "@context/progress";

export interface PokePulseDeps {
	auth: AuthContext;
	collection: CollectionContext;
	progress: ProgressContext;
}

export class PokePulse {
	public readonly auth: AuthContext;
	public readonly collection: CollectionContext;
	public readonly progress: ProgressContext;

	constructor(deps: PokePulseDeps) {
		this.auth = deps.auth;
		this.collection = deps.collection;
		this.progress = deps.progress;
	}
}
