import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export function CtaSection() {
	return (
		<section className="relative overflow-hidden">
			<div
				aria-hidden
				className="pointer-events-none absolute -bottom-24 left-1/2 -translate-x-1/2 size-125 rounded-full bg-primary/8 blur-[120px]"
			/>
			<Container
				padded
				className="relative py-24 flex flex-col items-center text-center gap-6"
			>
				<p className="font-mono text-[11px] uppercase tracking-widest text-primary">
					Ready?
				</p>
				<h2 className="text-3xl sm:text-4xl font-bold tracking-tight max-w-md">
					Your Pokédex won&apos;t complete itself.
				</h2>
				<p className="text-muted-foreground text-sm max-w-sm">
					Join trainers tracking their collection the right way — every state,
					every signature, every region.
				</p>
				<Button asChild size="lg" className="group">
					<Link href="/sign-in">
						Create your trainer account
						<span className="ml-1 transition-transform duration-200 group-hover:translate-x-1 inline-block">
							→
						</span>
					</Link>
				</Button>
				<p className="text-xs text-muted-foreground">
					Free.{" "}
					<Link
						className="underline underline-offset-4 hover:text-foreground transition-colors"
						href="/guides"
					>
						Read the guide first →
					</Link>
				</p>
			</Container>
		</section>
	);
}