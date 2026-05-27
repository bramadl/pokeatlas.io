import { usePokemonCard } from "../use-pokemon-card";

export function CardPointer() {
	const { pokemon } = usePokemonCard();

	const ariaLabel =
		pokemon.trackedStates.length > 0
			? `Untrack ${pokemon.name}`
			: `Track ${pokemon.name}`;

	return (
		<button
			aria-label={ariaLabel}
			className="absolute inset-0 z-2 cursor-pointer outline-none"
			onClick={() => {
				alert("Track the pokemon");
			}}
			tabIndex={-1}
			type="button"
		/>
	);
}
