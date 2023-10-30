import { LanguageConfigurationAdapter } from "../../gateways/language-configuration.adapter";

export interface ResolveConfigurationOutput {
  galiases: Record<
    string,
    {
      search: string;
      prefix: string;
      exclude: string[];
      rootDir: string;
    }
  >;
  languageConfigurationAdapters: LanguageConfigurationAdapter[];
}
