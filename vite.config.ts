import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "node:path";
import { normalizePath } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { defineConfig } from "vitest/config";
import { setupSimpleFakeApiHttpRoutes } from "@marco-pontes/simple-fake-api/bundler";

// https://vitejs.dev/config/
let environment = process.env.NODE_ENV || "development";

const apiConfig = setupSimpleFakeApiHttpRoutes(environment);

export default defineConfig({
	define: {
		...apiConfig,
	},
	plugins: [
		react(),
		tanstackRouter(),
		tsconfigPaths(),
		viteStaticCopy({
			targets: [
				{
					src: normalizePath(path.resolve("./src/assets/locales")),
					dest: normalizePath(path.resolve("./dist")),
				},
			],
		}),
	],
	server: {
		host: true,
		strictPort: true,
	},
	test: {
		environment: "jsdom",
		setupFiles: ["./vitest.setup.ts"],
		css: true,
		globals: true,
	},
});
