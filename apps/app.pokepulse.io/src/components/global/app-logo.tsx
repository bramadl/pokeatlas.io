import Link from "next/link";

export function AppLogo() {
	return (
		<Link href="/">
			<span className="mr-2">
				Poké<strong>Pulse</strong>
			</span>
			<span className="inline-flex items-center gap-2 text-muted/80 text-xs">
				<span>|</span>
				<span>PokemonGO Progress Tracker</span>
			</span>
		</Link>
	);
}
