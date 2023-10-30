import { LanguageConfigurationAdapter } from "../gateways/language-configuration.adapter";

export class MissingConfigurationError extends Error {
  constructor(configurationAdapter: LanguageConfigurationAdapter) {
    super(
      `You must create a ${configurationAdapter.configFileName} file in your project root to use Ralias with ${configurationAdapter.name}`,
    );
  }
}
