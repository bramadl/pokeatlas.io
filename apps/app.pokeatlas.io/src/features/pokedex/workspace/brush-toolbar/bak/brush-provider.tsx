"use client";

// import type {
// 	BrowsePokedexOutput,
// 	TrackPokemonInput,
// } from "@pokeatlas/core/types";
// import type { InfiniteData, QueryKey } from "@tanstack/react-query";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { useCallback, useRef, useState } from "react";

// import type { Pokemon } from "../../pokemon-card/card.types";
// import { useWorkspace } from "../workspace.context";
// import {
// 	applyBrushConstraints,
// 	applyBrushTap,
// 	type Brush,
// 	isDirty,
// } from "./brush";
import { BrushContext } from "./brush.context";

// type PokedexInfiniteData = InfiniteData<BrowsePokedexOutput>;

// type MutationContext = {
// 	snapshot: [QueryKey, PokedexInfiniteData | undefined][];
// };

export function BrushProvider({
	// action,
	children,
}: {
	// action(input: TrackPokemonInput): Promise<void>;
	children: React.ReactNode;
}) {
	// const queryClient = useQueryClient();

	// const [activeBrushes, setActiveBrushes] = useState<Brush[]>([]);
	// const [isOpen, setIsOpen] = useState(false);

	// const { trainerId } = useWorkspace();

	// const [pendingRefs, setPendingRefs] = useState<Set<string>>(new Set());
	// const pendingStatesRef = useRef<Map<string, string[]>>(new Map());

	// const { mutate } = useMutation<
	// 	void,
	// 	Error,
	// 	TrackPokemonInput,
	// 	MutationContext
	// >({
	// 	mutationFn: action,
	// 	onError: (_err, _vars, context) => {
	// 		setPendingRefs(new Set());
	// 		pendingStatesRef.current.clear();

	// 		if (!context) return;
	// 		for (const [queryKey, data] of context.snapshot) {
	// 			queryClient.setQueryData(queryKey, data);
	// 		}
	// 	},
	// 	onMutate: async (variables) => {
	// 		setPendingRefs((prev) => new Set(prev).add(variables.pokemonRef));

	// 		const encodedStates = variables.trackedStates.map((combo) =>
	// 			combo.join("+"),
	// 		);

	// 		pendingStatesRef.current.set(variables.pokemonRef, encodedStates);

	// 		const snapshot = queryClient.getQueriesData<PokedexInfiniteData>({
	// 			queryKey: ["browse-pokedex"],
	// 		});

	// 		queryClient.setQueriesData<PokedexInfiniteData>(
	// 			{ queryKey: ["browse-pokedex"] },
	// 			(old) => {
	// 				if (!old) return old;
	// 				return {
	// 					...old,
	// 					pages: old.pages.map((page) => ({
	// 						...page,
	// 						entries: page.entries.map((entry) =>
	// 							entry.id === variables.pokemonRef
	// 								? { ...entry, trackedStates: encodedStates }
	// 								: entry,
	// 						),
	// 					})),
	// 				};
	// 			},
	// 		);

	// 		return { snapshot };
	// 	},
	// 	onSettled: (_data, _err, variables) => {
	// 		setPendingRefs((prev) => {
	// 			const next = new Set(prev);
	// 			next.delete(variables.pokemonRef);
	// 			return next;
	// 		});

	// 		pendingStatesRef.current.delete(variables.pokemonRef);

	// 		if (pendingStatesRef.current.size > 0) {
	// 			queryClient.setQueriesData<PokedexInfiniteData>(
	// 				{ queryKey: ["browse-pokedex"] },
	// 				(old) => {
	// 					if (!old) return old;
	// 					return {
	// 						...old,
	// 						pages: old.pages.map((page) => ({
	// 							...page,
	// 							entries: page.entries.map((entry) => {
	// 								const pending = pendingStatesRef.current.get(entry.id);
	// 								return pending ? { ...entry, trackedStates: pending } : entry;
	// 							}),
	// 						})),
	// 					};
	// 				},
	// 			);
	// 		}
	// 	},
	// });

	// const onBrushChange = useCallback(
	// 	(values: string[]) => {
	// 		setActiveBrushes(applyBrushConstraints(activeBrushes, values as Brush[]));
	// 	},
	// 	[activeBrushes],
	// );

	// const onClearBrushes = useCallback(() => setActiveBrushes([]), []);

	// const onTap = useCallback(
	// 	(pokemon: Pokemon) => {
	// 		const newStates = applyBrushTap(pokemon.trackedStates, activeBrushes);
	// 		if (!isDirty(pokemon.trackedStates, newStates)) return;

	// 		mutate({
	// 			pokemonRef: pokemon.id,
	// 			trackedStates: newStates.map((sig) =>
	// 				sig === "BASE" ? ["BASE"] : sig.split("+"),
	// 			),
	// 			trainerId,
	// 		});
	// 	},
	// 	[activeBrushes, mutate, trainerId],
	// );

	// const onToggleOpen = useCallback(() => setIsOpen((v) => !v), []);

	// const isPending = pendingRefs.size > 0;

	return (
		<BrushContext.Provider
			value={{
				_: undefined,
				// activeBrushes,
				// isOpen,
				// isPending,
				// onBrushChange,
				// onClearBrushes,
				// onTap,
				// onToggleOpen,
				// pendingRefs,
			}}
		>
			{children}
		</BrushContext.Provider>
	);
}
