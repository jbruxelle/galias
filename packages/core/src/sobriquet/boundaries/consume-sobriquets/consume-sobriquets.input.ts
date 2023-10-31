import { LanguageConfigurationAdapter } from '../../gateways/language-configuration.adapter';

export interface ConsumeSobriquetsInput {
  languageConfigurationAdapters: LanguageConfigurationAdapter[];
  paths: Record<string, string>;
}
