import { LanguageConfigurationAdapter } from "../../gateways/language-configuration.adapter";

export interface ConsumeGaliasesInput {
  languageConfigurationAdapters: LanguageConfigurationAdapter[];
  paths: Record<string, string>;
}
