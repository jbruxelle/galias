import { LanguageConfigurationAdapterOptions } from "../../galias/gateways/language-configuration.adapter";
import { BaseLanguageConfigurationAdapter } from "./base.language.configuration.adapter";

export class TSConfigAdapter extends BaseLanguageConfigurationAdapter {
  constructor(_options?: LanguageConfigurationAdapterOptions) {
    super("typescript", "tsconfig.json", _options);
  }
}
