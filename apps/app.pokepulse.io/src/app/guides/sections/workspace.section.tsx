import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Kbd } from "@/components/ui/kbd";

import { SectionHeader } from "../ui";

export function WorkspaceSection() {
	return (
		<section className="scroll-mt-8" id="workspace">
			<SectionHeader
				description="The workspace is where you actually update your collection. It lives in the Pokédex view and gives you precise control over what you mark and how."
				eyebrow="Pokédex Feature"
				title="The Workspace"
			/>

			{/* Filter / View / Brush */}
			<div className="grid sm:grid-cols-3 gap-3 mb-8">
				{[
					{
						desc: "Narrow down the Pokédex by region, type, classification, tracking status, or search. Filters are synced to the URL.",
						tag: "Filters",
						tagClass: "bg-blue-500/10 text-blue-500 border-blue-500/20",
						title: "What you see",
					},
					{
						desc: "Switch between Base, Shiny, Hundo, Nundo, Shadow, Purified, or Lucky lens. Cards visually reflect the active view — making gaps easy to spot.",
						tag: "View Mode",
						tagClass: "bg-violet-500/10 text-violet-500 border-violet-500/20",
						title: "How you see it",
					},
					{
						desc: "Select a brush to decide which state you're tracking. Click a card to toggle that state on or off. The active brush is always visible in the toolbar.",
						tag: "Brushes",
						tagClass:
							"bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
						title: "What you mark",
					},
				].map(({ tag, tagClass, title, desc }) => (
					<Card className="gap-3" key={tag}>
						<CardHeader className="flex flex-col items-start pb-0">
							<span
								className={`self-start font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 rounded border ${tagClass}`}
							>
								{tag}
							</span>
							<CardTitle className="text-sm mt-1">{title}</CardTitle>
						</CardHeader>
						<CardContent>
							<CardDescription className="text-xs">{desc}</CardDescription>
						</CardContent>
					</Card>
				))}
			</div>

			<h3 className="text-base font-semibold tracking-tight mb-3">
				Brush Behavior
			</h3>
			<div className="flex flex-col gap-2 mb-8">
				{[
					{
						desc: "Toggles the selected state on or off for that Pokémon.",
						label: "Single click",
					},
					{
						desc: "Applies the state directly without toggling — useful for marking many Pokémon in a row.",
						label: "Shift + hotkey",
					},
					{
						desc: "Removes all tracked states from a Pokémon at once. Use with care.",
						label: "Backspace / Eraser 🧹",
					},
				].map(({ label, desc }) => (
					<div
						className="flex gap-3 items-start rounded-xl border border-border bg-card px-4 py-3"
						key={label}
					>
						<strong className="text-sm shrink-0 min-w-36">{label}</strong>
						<p className="text-muted-foreground text-sm">{desc}</p>
					</div>
				))}
			</div>

			<h3 className="text-base font-semibold tracking-tight mb-3">
				Keyboard Hotkeys
			</h3>
			<p className="text-muted-foreground text-sm mb-4">
				Every brush has a keyboard shortcut. You can track entire runs without
				touching your mouse.
			</p>
			<div className="flex flex-wrap gap-2">
				{[
					{ key: "B", label: "Base" },
					{ key: "S", label: "Shiny" },
					{ key: "W", label: "Shadow" },
					{ key: "P", label: "Purified" },
					{ key: "L", label: "Lucky" },
					{ key: "H", label: "Hundo" },
					{ key: "N", label: "Nundo" },
					{ key: "Backspace", label: "Eraser" },
					{ key: "ESC", label: "Back to Base" },
				].map(({ key, label }) => (
					<div className="flex items-center gap-1.5" key={key}>
						<Kbd>{key}</Kbd>
						<span className="text-muted-foreground text-xs">{label}</span>
					</div>
				))}
			</div>
		</section>
	);
}
