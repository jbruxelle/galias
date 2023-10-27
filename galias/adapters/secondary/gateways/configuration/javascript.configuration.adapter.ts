import { ConfigurationAdapterOptions } from "../../../../core/gateways/configuration.adapter";
import { LanguageConfigurationAdapter } from "./language.configuration.adapter";

export class JSConfigAdapter extends LanguageConfigurationAdapter {
  constructor(_options?: ConfigurationAdapterOptions) {
    super("javascript", "jsconfig.json", _options);
  }
}
