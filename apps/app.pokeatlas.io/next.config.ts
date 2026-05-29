import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	experimental: {
		optimizePackageImports: ["@phosphor-icons/react"],
	},
	images: {
		remotePatterns: [
			{ hostname: "raw.githubusercontent.com", protocol: "https" },
		],
	},
	reactCompiler: true,
	transpilePackages: ["@pokeatlas/database"],
};

export default nextConfig;
