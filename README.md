# sobriquet

Write aliases using glob patterns and variables.

## Current state

This project is in a very early stage. Any feedback is welcome.

A vite-plugin is available at this moment.

Next steps:

- [ ] Add documentation
- [ ] Add examples
- [ ] Add support for other bundlers (unplugin ?)
- [ ] Use Chodikar for all (currently using [vite-plugin-watch-and-run](https://github.com/jycouet/kitql/tree/main/packages/vite-plugin-watch-and-run) ([link to npm](https://www.npmjs.com/package/vite-plugin-watch-and-run)))

## Installation

```bash
npm i -D @sobriquet/vite
```

```bash
yarn add -d @sobriquet/vite
```

```bash
pnpm i -D @sobriquet/vite
```

## Usage

### With vite

```ts
// vite.config.ts
import { defineConfig } from "vite";
import sobriquet from "@sobriquet/vite";

export default defineConfig({
  plugins: [
    sobriquet({
      tsconfig: {
        source: "./tsconfig.base.json",
        output: "./tsconfig.json",
      },
      //   jsconfig: {
      //     source: './jsconfig.base.json',
      //     output: './jsconfig.json',
      //   },
      rootDir: "./src",
      prefix: "#",
      exclude: ["**/*.test.ts"],
      sobriquetes: {
        "my-sobriquet": "some/folder/file.ts",

        "{{component}}": "components/{{component}}/index.{tsx,jsx}",

        "{{domain}}/{{usecase}}": {
          search: "{{domain}}/**/usecases/{{usecase}}/{{usecase}}.usecase.ts",
          exclude: ["**/*.spec.ts"],
        },

        "{{domain}}/{{usecase}}/{{boundary}}": {
          search: "{{domain}}/**/boundaries/{{usecase}}/*.{{boundary}}.ts",
          prefix: "$",
          exclude: ["**/create/*.ts"],
          // rootDir: 'your-rootDir-for-this-sobriquet'
        },
      },
    }),
  ],
});
```

## Authors

- [@jbruxelle](https://github.com/jbruxelle/)
