import { defineBuildConfig } from 'unbuild';
import { buildConfigPreset } from '@sobriquet/config';

export default defineBuildConfig({
  preset: buildConfigPreset,
  name: '@sobriquet/core',
  entries: ['./src/index.ts'],
  externals: ['@sobriquet/utils'],
});
