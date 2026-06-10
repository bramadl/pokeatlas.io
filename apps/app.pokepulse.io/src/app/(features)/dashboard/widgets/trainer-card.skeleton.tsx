import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function TrainerCardSkeleton() {
	return (
		<Card>
			<CardContent className="flex items-start gap-4">
				<div className="flex-1 flex items-center gap-2">
					<div className="size-8 rounded-full bg-slate-100 animate-pulse" />
					<div className="flex flex-col gap-0">
						<span className="w-full h-3.5 rounded bg-slate-100 animate-pulse" />
						<span className="w-full h-3 rounded bg-slate-100 animate-pulse" />
					</div>
				</div>
				<div className="w-16 h-4 rounded bg-slate-100 animate-pulse" />
			</CardContent>
			<Separator />
			<CardHeader>
				<CardTitle className="w-16 h-4 rounded bg-slate-100 animate-pulse" />
				<CardDescription className="space-y-1">
					<div className="w-full h-3.5 rounded bg-slate-100 animate-pulse" />
					<div className="w-full h-3.5 rounded bg-slate-100 animate-pulse" />
					<div className="w-full h-3.5 rounded bg-slate-100 animate-pulse" />
				</CardDescription>
			</CardHeader>
			<CardContent className="flex items-center gap-2">
				<div className="w-40 h-9 rounded-full bg-slate-100 animate-pulse" />
				<div className="w-40 h-9 rounded-full bg-slate-100 animate-pulse" />
			</CardContent>
		</Card>
	);
}
