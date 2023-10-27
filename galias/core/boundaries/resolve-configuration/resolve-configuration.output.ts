import { ConfigurationAdapter } from "../../gateway/configuration.adapter";

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
  adapters: ConfigurationAdapter[];
}
