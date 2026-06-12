export function SectionHeader({
	eyebrow,
	title,
	description,
}: {
	eyebrow: string;
	title: string;
	description?: string;
}) {
	return (
		<div className="mb-8">
			<p className="font-mono text-[11px] uppercase tracking-widest text-primary mb-2">
				{eyebrow}
			</p>
			<h2 className="text-2xl font-bold tracking-tight mb-2">{title}</h2>
			{description && (
				<p className="text-muted-foreground text-sm max-w-xl">{description}</p>
			)}
		</div>
	);
}
