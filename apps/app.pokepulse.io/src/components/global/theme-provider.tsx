import { ThemeProvider as NextThemesProvider } from "@wrksz/themes";

export function ThemeProvider({
	children,
	...props
}: React.ComponentProps<typeof NextThemesProvider>) {
	return (
		<NextThemesProvider
			defaultTheme="light"
			enableSystem={false}
			forcedTheme="light"
			{...props}
		>
			{children}
		</NextThemesProvider>
	);
}
