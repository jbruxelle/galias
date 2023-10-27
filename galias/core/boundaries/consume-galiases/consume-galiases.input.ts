import { ConfigurationAdapter } from "../../gateway/configuration.adapter";

export interface ConsumeGaliasesInput {
  configurationAdapters: ConfigurationAdapter[];
  paths: Record<string, string>;
}
