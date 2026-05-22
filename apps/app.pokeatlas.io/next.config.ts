import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		remotePatterns: [
			{ hostname: "raw.githubusercontent.com", protocol: "https" },
		],
	},
	reactCompiler: true,
};

export default nextConfig;
