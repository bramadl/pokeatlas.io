import Link from "next/link";

export function AppLogo() {
	return (
		<Link href="/">
			<span>
				Poké<strong>Pulse</strong>
			</span>
			<span className="inline-flex items-center gap-2 ml-2 text-muted/80 text-xs">
				<span>|</span>
				<span>PokemonGO Progress Tracker</span>
			</span>
		</Link>
	);
}
