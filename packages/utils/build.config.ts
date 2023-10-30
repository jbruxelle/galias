import { defineBuildConfig } from "unbuild";
import { buildConfigPreset } from "@galias/config";

export default defineBuildConfig({
  preset: buildConfigPreset,
  name: "@galias/utils",
  entries: ["./src/index.ts"],
});
