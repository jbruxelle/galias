import sobriquet from '@sobriquet/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    sobriquet({
      tsconfig: {
        source: './tsconfig.base.json',
        output: './tsconfig.json',
      },
      jsconfig: {
        source: './jsconfig.base.json',
        output: './jsconfig.json',
      },
      rootDir: './src',
      sobriquets: {
        '{{component}}': './components/{{component}}/index.tsx',
      },
    }),
    react(),
  ],
});
