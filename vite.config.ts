import { defineConfig } from "vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";

export default defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [tanstackRouter({ target: "react", autoCodeSplitting: true }), viteReact()],
  server: { host: true, port: 3000 },
  preview: { host: true, port: 3000 },
  build: { outDir: "dist", sourcemap: false },
});
