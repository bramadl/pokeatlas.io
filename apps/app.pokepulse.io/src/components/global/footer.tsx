import { Container } from "../ui/container";

export function GlobalFooter() {
	return (
		<footer className="bg-foreground dark:bg-sidebar text-background h-40">
			<Container className="flex items-center justify-between h-full" padded>
				Footer goes here
			</Container>
		</footer>
	);
}
