import { defineConfig, Plugin, ResolvedConfig } from "vite";
import reactPlugin from "@vitejs/plugin-react";
import WindiCSS from "vite-plugin-windicss";
import { writeFile, mkdir } from "fs/promises";

import path from "path";

// TODO: maybe publish this Vite plugin?
const logseqDevPlugin: () => Plugin = () => {
  let config: ResolvedConfig;

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const tapHtml = async (config: ResolvedConfig) => {
    await delay(1000);
    const { default: fetch } = await import("node-fetch");
    return await (
      await fetch(`http://${config.server.host}:${config.server.port}`)
    ).text();
  };

  return {
    name: "vite:logseq-dev-plugin",
    enforce: "post",
    apply: "serve",
    config: async (config) => {
      if (
        !config.server.host ||
        !config.server.port ||
        !config.server.strictPort
      ) {
        throw new Error(
          "logseq-dev-plugin requires server.host, server.port, and server.strictPort to be set"
        );
      }
      config.base = `http://${config.server.host}:${config.server.port}`;
      return config;
    },
    configResolved(resolvedConfig) {
      // store the resolved config
      config = resolvedConfig;
    },

    buildStart: async () => {
      tapHtml(config).then(async (html) => {
        const baseHref = `http://${config.server.host}:${config.server.port}`;
        const baseString = `<base href="${baseHref}">`;

        const htmlWithBase = html.replace(`<head>`, `<head>${baseString}`);

        await mkdir(config.build.outDir, { recursive: true });
        await writeFile(
          path.resolve(config.build.outDir, "index.html"),
          htmlWithBase,
          {
            encoding: "utf-8",
          }
        );
        console.info("Wrote development index.html");
      });
    },
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [logseqDevPlugin(), reactPlugin(), WindiCSS()],
  clearScreen: false,
  base: "",
  // Makes HMR available for development
  server: {
    cors: true,
    host: "localhost",
    hmr: {
      host: "localhost",
    },
    port: 4567,
    strictPort: true,
  },
  build: {
    target: "esnext",
    minify: "esbuild",
  },
});
