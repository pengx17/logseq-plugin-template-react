import { defineConfig, Plugin, ResolvedConfig } from "vite";
import reactPlugin from "@vitejs/plugin-react";
import WindiCSS from "vite-plugin-windicss";
import logseqDevPlugin from "vite-plugin-logseq";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [logseqDevPlugin(), reactPlugin(), WindiCSS()],
  // Makes HMR available for development
  build: {
    target: "esnext",
    minify: "esbuild",
  },
});
