import { Prettify } from "@galias/utils";

interface _LanguageOption {
  source: string;
  output?: string;
}

export type LanguageOption = Prettify<_LanguageOption>;
