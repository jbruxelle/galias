import { defineBuildConfig } from 'unbuild';
import { buildConfigPreset } from './build.config.preset';

export default defineBuildConfig([
  {
    preset: buildConfigPreset,
    name: '@galias/config',
    entries: [{ input: './index.ts' }],
    externals: ['unbuild'],
    failOnWarn: false,
  },
  {
    preset: buildConfigPreset,
    name: '@galias/config/prettier',
    outDir: './dist/prettier',
    declaration: false,
    entries: [{ input: './.prettierrc.cjs' }],
    externals: ['prettier'],
    failOnWarn: false,
  },
  {
    preset: buildConfigPreset,
    name: '@galias/config/eslint',
    outDir: './dist/eslint',
    declaration: false,
    entries: [{ input: './.eslintrc.cjs' }],
    externals: ['prettier'],
  },
]);
