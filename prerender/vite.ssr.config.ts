import { defineConfig } from "vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";

export default defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [tanstackRouter({ target: "react", autoCodeSplitting: false }), viteReact()],
  build: {
    ssr: "prerender/entry-server.tsx",
    outDir: "prerender/out",
    emptyOutDir: true,
    rollupOptions: { output: { format: "esm" } },
  },
  ssr: { noExternal: true },
});
