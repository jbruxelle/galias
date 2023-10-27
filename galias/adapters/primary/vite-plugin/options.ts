import { ConfigurationAdapter } from "../../../core/gateway/configuration.adapter";

export interface VitePluginGaliasOptions {
  prefix?: string;
  exclude?: string[];
  rootDir?: string;
  galiases?: Record<
    string,
    | string
    | {
        search: string;
        prefix?: string;
        exclude?: string[];
        rootDir?: string;
      }
  >;
  adapters?: ConfigurationAdapter[];
  logs?: boolean;
}
