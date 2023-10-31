import { defineBuildConfig } from 'unbuild';
import { buildConfigPreset } from '@sobriquet/config';

export default defineBuildConfig({
  preset: buildConfigPreset,
  name: '@sobriquet/vite',
  entries: ['./src/index.ts'],
});
