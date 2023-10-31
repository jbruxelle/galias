import { Prettify } from '@sobriquet/utils';
import { LanguageOption } from './plugin.options.language';
import { SobriquetOption } from './plugin.options.sobriquet';

interface _SobriquetPluginOptions {
  prefix?: string;
  exclude?: string[];
  rootDir?: string;
  sobriquets?: Record<string, string | SobriquetOption>;
  tsconfig?: boolean | LanguageOption;
  jsconfig?: boolean | LanguageOption;
  logs?: boolean;
}

export type SobriquetPluginOptions = Prettify<_SobriquetPluginOptions>;
