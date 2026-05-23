import { defineConfig, env } from "prisma/config";

export default defineConfig({
	datasource: {
		url: env("DIRECT_URL"),
	},
	migrations: {
		path: "src/prisma/migrations",
		seed: "bun src/prisma/seed",
	},
	schema: "src/prisma",
});
