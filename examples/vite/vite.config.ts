import galias from "@galias/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    galias({
      tsconfig: {
        source: "./tsconfig.base.json",
        output: "./tsconfig.json",
      },
      jsconfig: {
        source: "./jsconfig.base.json",
        output: "./jsconfig.json",
      },
      rootDir: "./src",
      galiases: {
        "{{component}}": "./components/{{component}}/index.tsx",
      },
    }),
    react(),
  ],
});
