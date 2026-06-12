import { createStore } from "zustand/vanilla";

export type PokedexState = {
	defaultSignature: string;
	isEraserActive?: boolean;
	limit: number;
	trackingSignature: string;
	trainerId: string;
};

export type PokedexActions = {
	setIsEraserActive: (value: boolean) => void;
	setTrackingSignature: (signature: string) => void;
};

export type PokedexStore = PokedexState & PokedexActions;

export const defaultInitState: PokedexState = {
	defaultSignature: null,
	isEraserActive: false,
	limit: null,
	trackingSignature: null,
	trainerId: null,
} as unknown as PokedexState;

export const createPokedexStore = (
	initState: PokedexState = defaultInitState,
) => {
	return createStore<PokedexStore>()((set) => ({
		...initState,
		setIsEraserActive(value) {
			return set(() => ({ isEraserActive: value }));
		},
		setTrackingSignature(signature) {
			return set(() => ({ trackingSignature: signature }));
		},
	}));
};
