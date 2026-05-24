import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function PokedexFilterCard() {
	const types = [
		"bug",
		"dark",
		"dragon",
		"electric",
		"fairy",
		"fighting",
		"fire",
		"flying",
		"ghost",
		"grass",
		"ground",
		"ice",
		"normal",
		"poison",
		"psychic",
		"rock",
		"steel",
		"water",
	];

	return (
		<Card>
			<CardContent>
				<div className="grid grid-cols-2 gap-4">
					<div className="flex flex-col gap-4">
						<div className="flex flex-col gap-1">
							<p className="font-bold text-muted-foreground uppercase">
								Status
							</p>
							<div className="flex items-center gap-0.5">
								<Button asChild size={"sm"} variant="default">
									<Link
										href={{
											pathname: "/",
											search: "?status=all",
										}}
									>
										All
									</Link>
								</Button>
								<Button asChild size={"sm"} variant="secondary">
									<Link
										href={{
											pathname: "/",
											search: "?status=caught",
										}}
									>
										Caught
									</Link>
								</Button>
								<Button asChild size={"sm"} variant="secondary">
									<Link
										href={{
											pathname: "/",
											search: "?status=missing",
										}}
									>
										Missing
									</Link>
								</Button>
							</div>
						</div>
						<div className="flex flex-col gap-1">
							<p className="font-bold text-muted-foreground uppercase">Forms</p>
							<div className="flex items-center gap-0.5">
								<Button asChild size={"sm"} variant="default">
									<Link
										href={{
											pathname: "/",
											search: "?forms=mega",
										}}
									>
										Mega
									</Link>
								</Button>
								<Button asChild size={"sm"} variant="secondary">
									<Link
										href={{
											pathname: "/",
											search: "?forms=alternate",
										}}
									>
										Alternate
									</Link>
								</Button>
								<Button asChild size={"sm"} variant="secondary">
									<Link
										href={{
											pathname: "/",
											search: "?forms=female",
										}}
									>
										Female
									</Link>
								</Button>
								<Button asChild size={"sm"} variant="secondary">
									<Link
										href={{
											pathname: "/",
											search: "?forms=costume",
										}}
									>
										Costume
									</Link>
								</Button>
							</div>
						</div>
					</div>
					<div>
						<div className="flex flex-col gap-1">
							<p className="font-bold text-muted-foreground uppercase">Types</p>
							<div className="grid grid-cols-6 gap-0.5">
								{types.map((type) => (
									<Button
										aria-label={type}
										key={type}
										size={"sm"}
										type="button"
										variant="secondary"
									>
										<Image
											alt={type}
											height={20}
											src={`/pokemon-types/${type}.png`}
											width={20}
										/>
									</Button>
								))}
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
