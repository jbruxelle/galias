import { LanguageConfigurationAdapterOptions } from "../../galias/gateways/language-configuration.adapter";
import { BaseLanguageConfigurationAdapter } from "./base.language.configuration.adapter";

export class JSConfigAdapter extends BaseLanguageConfigurationAdapter {
  constructor(_options?: LanguageConfigurationAdapterOptions) {
    super("javascript", "jsconfig.json", _options);
  }
}
