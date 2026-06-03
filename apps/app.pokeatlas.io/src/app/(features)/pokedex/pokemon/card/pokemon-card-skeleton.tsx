function ContentSkeleton() {
	return (
		<div className="relative z-1 size-full pt-10 mt-2 flex flex-col items-center rounded-lg">
			<div className="px-3 py-4 text-center">
				<div className="w-8 h-3 bg-muted animate-pulse rounded-full mx-auto px-1.5 py-0.5" />
				<div className="h-4 w-24 bg-muted animate-pulse mt-1 rounded-full" />
			</div>
		</div>
	);
}

function ImageSkeleton() {
	return (
		<figure className="absolute z-3 top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 size-20 rounded-full border border-border/50">
			<div className="flex items-center absolute z-1 left-1/2 bottom-px -translate-x-1/2 translate-y-1/2">
				{Array(2)
					.fill(null)
					.map((_, index) => (
						<div
							className="bg-muted border border-background rounded-full mx-px size-4"
							key={index.toString()}
						/>
					))}
			</div>

			<div className="relative size-full overflow-hidden">
				<div className="object-contain p-1 size-full rounded-full bg-muted" />
			</div>
		</figure>
	);
}

export function PokemonCardSkeleton() {
	return (
		<div className="relative group mt-10 bg-background drop-shadow-xl drop-shadow-black/5 rounded-lg">
			<ImageSkeleton />
			<div className="size-full">
				<ContentSkeleton />
			</div>
		</div>
	);
}
