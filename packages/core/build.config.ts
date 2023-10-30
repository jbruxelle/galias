import { defineBuildConfig } from "unbuild";
import { buildConfigPreset } from "@galias/config";

export default defineBuildConfig({
  preset: buildConfigPreset,
  name: "@galias/core",
  entries: ["./src/index.ts"],
  externals: ["@galias/utils"],
});
