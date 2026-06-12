export function TableOfContent() {
	return (
		<div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
			{[
				{ emoji: "🎯", href: "#tracking-states", label: "Tracking States" },
				{ emoji: "🗂️", href: "#workspace", label: "Workspace" },
				{ emoji: "📖", href: "#pokedex", label: "Pokédex" },
				{ emoji: "📊", href: "#dashboard", label: "Dashboard" },
				{ emoji: "🌟", href: "#cotd", label: "Catch of the Day" },
				{ emoji: "❓", href: "#faq", label: "FAQ" },
			].map(({ href, emoji, label }) => (
				<a
					className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-border bg-card text-sm text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
					href={href}
					key={href}
				>
					<span>{emoji}</span>
					<span className="font-medium">{label}</span>
				</a>
			))}
		</div>
	);
}
