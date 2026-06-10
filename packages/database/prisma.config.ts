import { defineConfig, env } from "prisma/config";

export default defineConfig({
	datasource: {
		url: env("DIRECT_URL"),
	},
	experimental: {
		externalTables: true,
	},
	migrations: {
		path: "src/prisma/migrations",
		seed: "bun src/prisma/seed",
	},
	schema: "src/prisma",
	tables: {
		external: [
			"neon_auth.account",
			"neon_auth.invitation",
			"neon_auth.jwks",
			"neon_auth.member",
			"neon_auth.organization",
			"neon_auth.project_config",
			"neon_auth.session",
			"neon_auth.user",
			"neon_auth.verification",
		],
	},
});
