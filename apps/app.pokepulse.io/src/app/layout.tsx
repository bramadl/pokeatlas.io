import type { Metadata } from "next";
import { IBM_Plex_Mono, Lora, Plus_Jakarta_Sans } from "next/font/google";

import { GlobalFooter } from "@/components/global/footer";
import { GlobalNavigation } from "@/components/global/navigation";
// import { ThemeProvider } from "@/components/global/theme-provider";
import { GlobalProgressBar } from "@/components/ui/progress-bar";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NuqsProvider } from "@/lib/nuqs/nuqs-provider";
import { QueryProvider } from "@/lib/tanstack/query/query-provider";

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
	title: "PokemonGO Progress Tracker | PokePulse",
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
			suppressHydrationWarning
		>
			<body>
				<GlobalProgressBar>
					<NuqsProvider>
						<QueryProvider>
							<TooltipProvider>
								<GlobalNavigation />
								<main>{children}</main>
								<GlobalFooter />
							</TooltipProvider>
						</QueryProvider>
					</NuqsProvider>
				</GlobalProgressBar>
				<Toaster />
			</body>
		</html>
	);
}
