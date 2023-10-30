import { defineBuildConfig } from "unbuild";
import { buildConfigPreset } from "./build.config.preset";

export default defineBuildConfig({
  preset: buildConfigPreset,
  name: "@galias/config",
  entries: ["./index.ts"],
  externals: ["unbuild"],
});
