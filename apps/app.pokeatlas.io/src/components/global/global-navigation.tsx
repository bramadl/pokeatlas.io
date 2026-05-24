import Link from "next/link";

export function GlobalNavigation() {
	return (
		<header className="sticky top-0 h-16 bg-primary text-primary-foreground z-10">
			<div className="container mx-auto flex items-center justify-between h-full">
				<Link href="/">
					<h1 className="inline">
						Pokè<strong>Atlas</strong>
					</h1>
					<span className="inline-flex items-center gap-2 ml-2 text-muted/80 text-xs">
						<span>|</span>
						<span>PokemonGO Progress Tracker</span>
					</span>
				</Link>
			</div>
		</header>
	);
}
