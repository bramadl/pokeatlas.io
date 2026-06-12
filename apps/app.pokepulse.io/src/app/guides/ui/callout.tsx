export function Callout({ children }: { children: React.ReactNode }) {
	return (
		<div className="border-l-2 border-primary bg-accent/40 rounded-r-xl px-4 py-3 text-sm text-muted-foreground">
			{children}
		</div>
	);
}
