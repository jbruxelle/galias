import { defineBuildConfig } from 'unbuild';
import { buildConfigPreset } from './build.config.preset';

export default defineBuildConfig([
  {
    preset: buildConfigPreset,
    name: '@sobriquet/config',
    entries: [{ input: './index.ts' }],
    externals: ['unbuild'],
  },
]);
