import { GaliasPluginOptions } from "./plugin.options";
import type { Require, Prettify } from "@galias/utils";

type DefaultGaliasPluginOptions = Prettify<
  Require<
    GaliasPluginOptions,
    "prefix" | "exclude" | "rootDir" | "galiases" | "logs"
  >
>;

export const defaultPluginOptions: DefaultGaliasPluginOptions = {
  prefix: "$",
  exclude: ["node_modules"],
  rootDir: process.cwd(),
  galiases: {},
  logs: true,
  tsconfig: true,
};
