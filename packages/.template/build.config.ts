import { defineBuildConfig } from "unbuild";
import { buildConfigPreset } from "@sobriquet/config";

export default defineBuildConfig({
  preset: buildConfigPreset,
  name: "@sobriquet/PACKAGE_NAME",
  entries: [],
});
