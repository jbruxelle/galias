import { ConfigurationAdapter } from "../../../core/gateways/configuration.adapter";
import { Prettify } from "../../../shared/prettify";

interface _VitePluginGaliasOptions {
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

export type VitePluginGaliasOptions = Prettify<_VitePluginGaliasOptions>;
