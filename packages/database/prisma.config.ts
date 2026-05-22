import { defineConfig, env } from "prisma/config";

export default defineConfig({
	datasource: {
		url: env("DIRECT_URL"),
	},
	migrations: {
		path: "prisma/migrations",
		seed: "bun prisma/seed",
	},
	schema: "prisma",
});
