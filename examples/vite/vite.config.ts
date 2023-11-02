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
      prefix: '#',
      rootDir: './src',
      exclude: ['**/*.spec.ts'],
      sobriquets: {
        '{{domain}}/{{usecase}}':
          '{{domain}}/**/usecases/{{usecase}}/{{usecase}}.usecase.ts',

        '{{domain}}/{{usecase}}/{{boundary}}':
          '{{domain}}/**/boundaries/{{usecase}}/{{usecase}}.{{boundary}}.ts',

        'authentication/gateways/{{gateway}}': {
          search: '**/gateways/{{gateway}}.gateway.ts',
          prefix: '#',
          rootDir: './src/authentication',
          // ALSO AVAILABLE HERE :
          // exclude: ['**/*.spec.ts'],
          // rootDir: './',
        },

        '{{component}}': {
          search: './components/{{component}}/index.tsx',
          prefix: '$',
        },

        shared: './shared',

        '{{domain}}/exceptions/{{exception}}':
          '{{domain}}/**/exceptions/{{exception}}.exception.ts',
      },
    }),
    react(),
  ],
});
