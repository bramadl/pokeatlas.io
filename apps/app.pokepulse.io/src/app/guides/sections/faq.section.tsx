import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

import { FAQ } from "../data";
import { SectionHeader } from "../ui";

export function FaqSection() {
	return (
		<section className="scroll-mt-8" id="faq">
			<SectionHeader
				description="Quick answers to the most common questions."
				eyebrow="Frequently Asked"
				title="FAQ"
			/>

			<Accordion className="w-full" type="multiple">
				{FAQ.map(({ q, a }) => (
					<AccordionItem key={q} value={q}>
						<AccordionTrigger className="text-sm font-medium text-left">
							{q}
						</AccordionTrigger>
						<AccordionContent className="text-muted-foreground text-sm">
							{a}
						</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>
		</section>
	);
}
