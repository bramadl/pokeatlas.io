const COOKIE_NAME = "pp_auth_access";
const COOKIE_MAX_AGE = 60 * 5;
const COOKIE_VALID_WINDOW_MS = COOKIE_MAX_AGE * 1000;

function getSecret(): string {
	const secret = process.env.NEON_AUTH_COOKIE_SECRET;
	if (!secret) throw new Error("NEON_AUTH_COOKIE_SECRET is not set");
	return secret;
}

async function hmacSign(message: string, secret: string): Promise<string> {
	const encoder = new TextEncoder();
	const key = await crypto.subtle.importKey(
		"raw",
		encoder.encode(secret),
		{ hash: "SHA-256", name: "HMAC" },
		false,
		["sign"],
	);
	const signature = await crypto.subtle.sign(
		"HMAC",
		key,
		encoder.encode(message),
	);
	return Array.from(new Uint8Array(signature))
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");
}

async function hmacVerify(
	message: string,
	signature: string,
	secret: string,
): Promise<boolean> {
	const expected = await hmacSign(message, secret);
	if (expected.length !== signature.length) return false;
	let diff = 0;
	for (let i = 0; i < expected.length; i++) {
		diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
	}
	return diff === 0;
}

export async function buildAccessCookieValue(): Promise<string> {
	const timestamp = Date.now().toString();
	const signature = await hmacSign(timestamp, getSecret());
	return `${timestamp}.${signature}`;
}

export async function verifyAccessCookieValue(value: string): Promise<boolean> {
	const dotIndex = value.indexOf(".");
	if (dotIndex === -1) return false;

	const timestamp = value.slice(0, dotIndex);
	const signature = value.slice(dotIndex + 1);

	const ts = Number(timestamp);
	if (Number.isNaN(ts)) return false;
	if (Date.now() - ts > COOKIE_VALID_WINDOW_MS) return false;

	return hmacVerify(timestamp, signature, getSecret());
}

export { COOKIE_MAX_AGE, COOKIE_NAME };
