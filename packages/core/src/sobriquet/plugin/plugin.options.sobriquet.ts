import { Prettify } from '@sobriquet/utils';

interface _SobriquetOption {
  search: string;
  prefix?: string;
  exclude?: string[];
  rootDir?: string;
}

export type SobriquetOption = Prettify<_SobriquetOption>;
