interface PokemonCardPointerProps {
	onTap?: () => void;
	pokemonName: string;
	tracked?: boolean;
}

export function PokemonCardPointer({
	onTap,
	pokemonName,
	tracked,
}: PokemonCardPointerProps) {
	return (
		<button
			aria-label={`${tracked ? "Untrack" : "Track"} ${pokemonName}`}
			className="absolute inset-0 z-2 cursor-pointer outline-none"
			onClick={onTap}
			tabIndex={-1}
			type="button"
		/>
	);
}
