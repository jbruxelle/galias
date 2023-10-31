import { LanguageConfigurationAdapter } from '../../gateways/language-configuration.adapter';

export interface ResolveConfigurationOutput {
  sobriquets: Record<
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
