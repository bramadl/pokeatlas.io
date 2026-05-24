import Link from "next/link";

export function GlobalNavigation() {
	return (
		<header className="sticky top-0 h-16 bg-primary text-primary-foreground z-10">
			<div className="container mx-auto flex items-center justify-between h-full">
				<Link href="/">Logo goes here</Link>
			</div>
		</header>
	);
}
