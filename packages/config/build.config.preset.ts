import { definePreset } from "unbuild";

export const buildConfigPreset = definePreset({
  declaration: true,
  clean: true,
  outDir: "dist",
  // failOnWarn: true,
  rollup: {
    emitCJS: true,
    inlineDependencies: true,
    esbuild: {
      minify: true,
    },
  },
});
