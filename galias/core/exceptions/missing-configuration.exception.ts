import { ConfigurationAdapter } from "../gateways/configuration.adapter";

export class MissingConfigurationError extends Error {
  constructor(configurationAdapter: ConfigurationAdapter) {
    super(
      `You must create a ${configurationAdapter.configFileName} file in your project root to use Ralias with ${configurationAdapter.name}`,
    );
  }
}
