import { getJson } from "./fetcher";

const I18N_URL =
	"https://raw.githubusercontent.com/PokeMiners/pogo_assets/master/Texts/Latest%20APK/JSON/i18n_english.json";

export async function fetchI18nEntries(): Promise<Map<string, string>> {
	const raw = await getJson<{ data: string[] }>(I18N_URL);
	const map = new Map<string, string>();

	for (let i = 0; i < raw.data.length - 1; i += 2) {
		map.set(raw.data[i] as string, raw.data[i + 1] as string);
	}

	return map;
}

const TREE_URL =
	"https://api.github.com/repos/PokeMiners/pogo_assets/git/trees/HEAD:Images/Pokemon/Addressable%20Assets";

export async function fetchSpriteFilenames(): Promise<Set<string>> {
	const data = await getJson<{ tree: Array<{ path: string; type: string }> }>(
		TREE_URL,
	);

	return new Set(
		data.tree
			.filter((e) => e.type === "blob" && e.path.endsWith(".png"))
			.map((e) => e.path),
	);
}
