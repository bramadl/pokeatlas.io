import type { Metadata } from "next";
import { IBM_Plex_Mono, Lora, Plus_Jakarta_Sans } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { GlobalProgressBar } from "@/components/global/progress-bar";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ReactQueryProvider } from "@/lib/tanstack/query/provider";

import "./globals.css";

const fontSans = Plus_Jakarta_Sans({
	subsets: ["latin"],
	variable: "--font-sans",
});

const fontSerif = Lora({
	subsets: ["latin"],
	variable: "--font-serif",
});

const fontMono = IBM_Plex_Mono({
	subsets: ["latin"],
	variable: "--font-mono",
	weight: ["400", "700"],
});

export const metadata: Metadata = {
	description: "Track your Pokémon GO collection progress in one place.",
	title: "PokemonGO Progress Tracker | PokeAtlas",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} antialiased`}
			lang="en"
		>
			<body>
				<NuqsAdapter>
					<GlobalProgressBar>
						<ReactQueryProvider>
							<TooltipProvider>{children}</TooltipProvider>
						</ReactQueryProvider>
					</GlobalProgressBar>
				</NuqsAdapter>
				<Toaster />
			</body>
		</html>
	);
}
