import { Prettify } from "@galias/utils";
import { LanguageOption } from "./plugin.options.language";
import { GaliasOption } from "./plugin.options.galias";

interface _GaliasPluginOptions {
  prefix?: string;
  exclude?: string[];
  rootDir?: string;
  galiases?: Record<string, string | GaliasOption>;
  tsconfig?: boolean | LanguageOption;
  jsconfig?: boolean | LanguageOption;
  logs?: boolean;
}

export type GaliasPluginOptions = Prettify<_GaliasPluginOptions>;
