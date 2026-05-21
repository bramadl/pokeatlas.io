export async function getJson<T>(url: string): Promise<T> {
	const res = await fetch(url, {
		headers: {
			Accept: "application/json",
			...(process.env.GITHUB_TOKEN
				? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
				: {}),
		},
	});

	if (!res.ok) throw new Error(`Failed to fetch ${url}: HTTP ${res.status}`);
	return res.json() as Promise<T>;
}

export async function getText(url: string): Promise<string> {
	const res = await fetch(url, {
		headers: {
			Accept: "text/plain",
			...(process.env.GITHUB_TOKEN
				? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
				: {}),
		},
	});

	if (!res.ok) throw new Error(`Failed to fetch ${url}: HTTP ${res.status}`);
	return res.text();
}
