import { ConfigurationAdapterOptions } from "../../../../core/gateways/configuration.adapter";
import { LanguageConfigurationAdapter } from "./language.configuration.adapter";

export class TSConfigAdapter extends LanguageConfigurationAdapter {
  constructor(_options?: ConfigurationAdapterOptions) {
    super("typescript", "tsconfig.json", _options);
  }
}
