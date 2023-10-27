import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import galias from "vite-plugin-galias";
import { TSConfigAdapter, JSConfigAdapter } from "vite-plugin-galias/adapters";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    galias({
      adapters: [
        new TSConfigAdapter({
          source: "./tsconfig.base.json",
          output: "./tsconfig.json",
        }),
        new JSConfigAdapter({
          source: "./jsconfig.base.json",
          output: "./jsconfig.json",
        }),
      ],
      rootDir: "./src",
      galiases: {
        "{{component}}": "./components/{{component}}/index.tsx",
      },
    }),
    react(),
  ],
});
