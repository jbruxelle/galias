import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  test: {
    globals: true,
    exclude: ["samples", "node_modules"],
  },
  plugins: [dts({ rollupTypes: true })],
  // build: {
  //   lib: {
  //     entry: {
  //       index: resolve(__dirname, "./adapters/primary/vite-plugin/plugin.ts"),
  //       adapters: resolve(
  //         __dirname,
  //         "./adapters/secondary/gateways/configuration"
  //       ),
  //     },
  //     name: "galias",
  //     formats: ["es", "cjs"],
  //   },
  //   rollupOptions: {
  //     external: ["fs/promises", "path", "path/posix", "glob", "picomatch"],
  //     input: {
  //       index: resolve(__dirname, "./adapters/primary/vite-plugin/plugin.ts"),
  //       adapters: resolve(
  //         __dirname,
  //         "./adapters/secondary/gateways/configuration"
  //       ),
  //     },
  //   },
  // },
});
