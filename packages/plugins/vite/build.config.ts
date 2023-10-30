import { defineBuildConfig } from 'unbuild';
import { buildConfigPreset } from '@galias/config';

export default defineBuildConfig({
  preset: buildConfigPreset,
  name: '@galias/vite',
  entries: ['./src/index.ts'],
});
