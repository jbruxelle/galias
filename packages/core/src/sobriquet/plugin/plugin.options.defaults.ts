import type { Require, Prettify } from '@sobriquet/utils';
import { SobriquetPluginOptions } from './plugin.options';

type DefaultSobriquetPluginOptions = Prettify<
  Require<
    SobriquetPluginOptions,
    'prefix' | 'exclude' | 'rootDir' | 'sobriquets' | 'logs'
  >
>;

export const defaultPluginOptions: DefaultSobriquetPluginOptions = {
  prefix: '$',
  exclude: ['node_modules'],
  rootDir: process.cwd(),
  sobriquets: {},
  logs: true,
  tsconfig: true,
};
