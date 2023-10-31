import { Prettify } from '@sobriquet/utils';

interface _LanguageOption {
  source: string;
  output?: string;
}

export type LanguageOption = Prettify<_LanguageOption>;
