import { Prettify } from '@galias/utils';

interface _GaliasOption {
  search: string;
  prefix?: string;
  exclude?: string[];
  rootDir?: string;
}

export type GaliasOption = Prettify<_GaliasOption>;
