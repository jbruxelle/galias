import { defineConfig, type Options } from "tsup";

const entries: Record<string, string> = {
  index: "adapters/primary/vite-plugin/plugin.ts",
  adapters: "adapters/secondary/gateways/configuration/index.ts",
};

const commonOptions: Options = {
  clean: true,
  minify: true,
  dts: true,
  treeshake: true,
  entry: entries,
};

export default defineConfig([
  {
    ...commonOptions,
    format: "cjs",
    outDir: "dist/cjs",
  },
  {
    ...commonOptions,
    format: "esm",
    outDir: "dist/esm",
    onSuccess: "cp package.json dist/package.json",
  },
]);
