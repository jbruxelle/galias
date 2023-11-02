import path from 'node:path';

const VITE_CONFIG_EXTENSIONS = new Set(['.ts', '.js', '.mjs', '.cjs']);
const VITE_CONFIG_NAMES = new Set(['vite.config', 'vitest.config']);

export const isVite = () => {
  // @ts-ignore
  if (import.meta.env) {
    return true;
  }
  return false;
};

export const isViteConfig = (filepath: string) => {
  const extension = path.extname(filepath);
  const filename = path.basename(filepath);

  const hasCorrectExtension = VITE_CONFIG_EXTENSIONS.has(extension);
  const hasCorrectName = VITE_CONFIG_NAMES.has(filename);

  if (hasCorrectExtension && hasCorrectName) {
    return true;
  }

  return false;
};
