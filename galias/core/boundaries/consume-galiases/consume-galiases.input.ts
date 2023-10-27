import { ConfigurationAdapter } from "../../gateways/configuration.adapter";

export interface ConsumeGaliasesInput {
  configurationAdapters: ConfigurationAdapter[];
  paths: Record<string, string>;
}
