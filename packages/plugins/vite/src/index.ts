import { resolve } from 'node:path';
import { normalizePath, type Plugin, type ViteDevServer } from 'vite';

import watchAndRun, {
  Options as WatchAndRunOptions,
} from 'vite-plugin-watch-and-run';

import { createMessage, isViteConfig } from '@sobriquet/utils';

import {
  ComputeSobriquetsUsecase,
  ConsumeSobriquetsUsecase,
  SobriquetPath,
  SobriquetPluginOptions,
  InferPathsVariablesService,
  IsaacsGlobFSAdapter,
  NodePathAdapter,
  PicomatchGlobMatchAdapter,
  ResolveConfigurationInput,
  ResolveConfigurationOutput,
  ResolveConfigurationUsecase,
  ResolveSobriquetPathService,
  defaultPluginOptions,
} from '@sobriquet/core';

type ConfigureServerHook = (server: ViteDevServer) => Promise<() => void>;

export default (options: SobriquetPluginOptions): Plugin => {
  let watchAndRunConfigureServer: ConfigureServerHook;
  let computedSobriquets: Record<string, string> = {};

  const globMatchAdapter = new PicomatchGlobMatchAdapter();
  const globFSAdapter = new IsaacsGlobFSAdapter();
  const pathAdapter = new NodePathAdapter();
  const inferPathsVariablesService = new InferPathsVariablesService();
  const resolveSobriquetPathService = new ResolveSobriquetPathService(
    globMatchAdapter,
    globFSAdapter,
    inferPathsVariablesService
  );

  const resolveConfigurationUsecase = new ResolveConfigurationUsecase();

  const computeSobriquetsUsecase = new ComputeSobriquetsUsecase(
    pathAdapter,
    resolveSobriquetPathService
  );

  const consumeSobriquetsUsecase = new ConsumeSobriquetsUsecase();

  const message = createMessage(options.logs);

  const runSobriquet = async ({
    sobriquets,
    languageConfigurationAdapters,
  }: ResolveConfigurationOutput) => {
    computedSobriquets = await computeSobriquetsUsecase.execute({
      sobriquets,
    });

    await consumeSobriquetsUsecase.execute({
      languageConfigurationAdapters,
      paths: computedSobriquets,
    });

    message('Sobriquets updated!', 'info');
  };

  return {
    name: 'vite-plugin-sobriquet',
    async configResolved() {
      const mergedOptions: ResolveConfigurationInput = {
        ...defaultPluginOptions,
        ...options,
      };

      const resolvedConfiguration =
        await resolveConfigurationUsecase.execute(mergedOptions);

      const sobriquetsOptions = Object.values(resolvedConfiguration.sobriquets);

      await runSobriquet(resolvedConfiguration);

      const watchAndRunOptions: WatchAndRunOptions[] = [
        {
          logs: [],
          watchFile: async (filePath: string) => {
            const path = normalizePath(filePath);

            if (isViteConfig(path)) {
              return await Promise.resolve(true);
            }

            for (const sobriquetOptions of sobriquetsOptions) {
              const { search, rootDir, exclude } = sobriquetOptions;
              const isExcluded = globMatchAdapter.isMatch(path, exclude);

              if (isExcluded) {
                continue;
              }

              const searchFullPath = resolve(rootDir, search);
              const normalizedSearchFullPath = normalizePath(searchFullPath);
              const glob = SobriquetPath.globFrom(normalizedSearchFullPath);
              const isMatch = globMatchAdapter.isMatch(path, glob);

              if (isMatch) {
                return await Promise.resolve(true);
              }
            }

            return await Promise.resolve(false);
          },
          watchKind: ['add', 'addDir', 'unlink', 'unlinkDir', 'change'],
          async run() {
            await runSobriquet(resolvedConfiguration);
          },
        },
      ];

      const { configureServer } = watchAndRun(watchAndRunOptions);
      watchAndRunConfigureServer = configureServer as ConfigureServerHook;
    },

    async resolveId(id, importer) {
      const path = computedSobriquets[id];

      if (!path) {
        message(`Sobriquet "${id}" not found!`, 'error');
        message(
          'Please check your Sobriquet configuration (rootDir, relative paths, ...).',
          'warning'
        );
        return;
      }

      const pathWithBaseUrl = resolve(path);
      return await this.resolve(pathWithBaseUrl, importer, {
        skipSelf: true,
      });
    },

    async configureServer(server) {
      await watchAndRunConfigureServer(server);
    },
  };
};
