import { defineConfig } from "vite";

export default defineConfig({
  test: {
    globals: true,
    exclude: ["samples", "node_modules"],
  },
});
