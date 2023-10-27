import { ConfigurationAdapter } from "../../gateways/configuration.adapter";

export interface ResolveConfigurationInput {
  prefix: string;
  exclude: string[];
  rootDir: string;
  galiases: Record<
    string,
    | string
    | {
        search: string;
        prefix?: string;
        exclude?: string[];
        rootDir?: string;
      }
  >;
  adapters: ConfigurationAdapter[];
}
