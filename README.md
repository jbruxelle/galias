# sobriquet

Write aliases using glob patterns and variables.

## Current state

This project is in a very early stage. Any feedback is welcome.

A vite-plugin is available at this moment.

Next steps:

- [ ] Add documentation
- [ ] Add examples
- [ ] Add support for other bundlers (unplugin ?)

## Installation

```bash
npm i -D vite-plugin-sobriquet
```

```bash
yarn add -d vite-plugin-sobriquet
```

```bash
pnpm i -D vite-plugin-sobriquet
```

## Usage

### With vite

```ts
// vite.config.ts
import { defineConfig } from "vite";
import sobriquet from "vite-plugin-sobriquet";
import {
  TSConfigAdapter /** JSConfigAdapter */,
} from "vite-plugin-sobriquet/adapters";

export default defineConfig({
  plugins: [
    sobriquet({
      adapters: [
        new TSConfigAdapter({
          source: "tsconfig.base.json",
          output: "tsconfig.json",
        }),
      ],
      rootDir: "./src",
      prefix: "#",
      exclude: ["**/*.test.ts"],
      sobriquetes: {
        "my-alias": "some/folder/file.ts",
        "{{component}}": "components/{{component}}/index.{tsx,jsx}",
        "{{domain}}/{{usecase}}": {
          search: "{{domain}}/**/usecases/{{usecase}}/{{usecase}}.usecase.ts",
          exclude: ["**/*.spec.ts"],
        },
        "{{domain}}/{{usecase}}/{{boundary}}": {
          search: "{{domain}}/**/boundaries/{{usecase}}/*.{{boundary}}.ts",
          prefix: "$",
          exclude: ["**/create/*.ts"],
        },
      },
    }),
  ],
});
```
