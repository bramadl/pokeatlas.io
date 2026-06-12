import type { Icon } from "@phosphor-icons/react";
import Link from "next/link";
import { Fragment } from "react/jsx-runtime";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface EmptyWidgetProps {
	description: string;
	Icon: Icon;
	title: string;
	withAction?: { href: string; label: string };
}

export function EmptyWidget({
	Icon,
	title,
	description,
	withAction,
}: EmptyWidgetProps) {
	return (
		<Card>
			<CardContent>
				<div className="flex flex-col items-center gap-4 py-4 px-8 text-center text-muted-foreground">
					<div className="flex items-center justify-center size-16 rounded-full border bg-slate-50">
						<Icon className="size-6" />
					</div>
					<div className="flex flex-col gap-1">
						<p className="font-medium text-xsm">{title}</p>
						<p className="text-xs">{description}</p>
					</div>
				</div>
			</CardContent>
			{withAction && (
				<Fragment>
					<Separator />
					<CardFooter>
						<Button asChild className="w-full" size="sm" variant="outline">
							<Link href={withAction.href}>{withAction.label}</Link>
						</Button>
					</CardFooter>
				</Fragment>
			)}
		</Card>
	);
}
