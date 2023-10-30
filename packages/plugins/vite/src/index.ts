import { resolve } from "path";
import { normalizePath, type Plugin, type ViteDevServer } from "vite";

import {
  default as watchAndRun,
  Options as WatchAndRunOptions,
} from "vite-plugin-watch-and-run";

import { createMessage } from "@galias/utils";

import {
  ComputeGaliasesUsecase,
  ConsumeGaliasesUsecase,
  GaliasPath,
  GaliasPluginOptions,
  InferPathsVariablesService,
  IsaacsGlobFSAdapter,
  NodePathAdapter,
  PicomatchGlobMatchAdapter,
  ResolveConfigurationInput,
  ResolveConfigurationOutput,
  ResolveConfigurationUsecase,
  ResolveGaliasPathService,
  defaultPluginOptions,
} from "@galias/core";

type ConfigureServerHook = (server: ViteDevServer) => Promise<() => void>;

export default (options: GaliasPluginOptions): Plugin => {
  let watchAndRunConfigureServer: ConfigureServerHook;
  let computedGaliases: Record<string, string> = {};

  const globMatchAdapter = new PicomatchGlobMatchAdapter();
  const globFSAdapter = new IsaacsGlobFSAdapter();
  const pathAdapter = new NodePathAdapter();
  const inferPathsVariablesService = new InferPathsVariablesService();
  const resolveGaliasPathService = new ResolveGaliasPathService(
    globMatchAdapter,
    globFSAdapter,
    inferPathsVariablesService,
  );

  const resolveConfigurationUsecase = new ResolveConfigurationUsecase();

  const computeGaliasesUsecase = new ComputeGaliasesUsecase(
    pathAdapter,
    resolveGaliasPathService,
  );

  const consumeGaliasesUsecase = new ConsumeGaliasesUsecase();

  const message = createMessage(options.logs);

  const runGalias = async ({
    galiases,
    languageConfigurationAdapters,
  }: ResolveConfigurationOutput) => {
    computedGaliases = await computeGaliasesUsecase.execute({
      galiases,
    });

    await consumeGaliasesUsecase.execute({
      languageConfigurationAdapters,
      paths: computedGaliases,
    });

    message("Galiases updated!", "info");
  };

  return {
    name: "vite-plugin-galias",
    async configResolved() {
      const mergedOptions: ResolveConfigurationInput = {
        ...defaultPluginOptions,
        ...options,
      };

      const resolvedConfiguration =
        await resolveConfigurationUsecase.execute(mergedOptions);

      const galiasesOptions = Object.values(resolvedConfiguration.galiases);

      await runGalias(resolvedConfiguration);

      const watchAndRunOptions: WatchAndRunOptions[] = [
        {
          logs: [],
          watchFile: async (filePath: string) => {
            const path = normalizePath(filePath);

            for (const galiasOptions of galiasesOptions) {
              const { search, rootDir, exclude } = galiasOptions;
              const isExcluded = globMatchAdapter.isMatch(path, exclude);

              if (isExcluded) {
                continue;
              }

              const searchFullPath = resolve(rootDir, search);
              const normalizedSearchFullPath = normalizePath(searchFullPath);
              const glob = GaliasPath.globFrom(normalizedSearchFullPath);
              const isMatch = globMatchAdapter.isMatch(path, glob);

              if (isMatch) {
                return true;
              }
            }

            return false;
          },
          watchKind: ["add", "addDir", "unlink", "unlinkDir", "change"],
          async run() {
            await runGalias(resolvedConfiguration);
          },
        },
      ];

      const { configureServer } = watchAndRun(watchAndRunOptions);
      watchAndRunConfigureServer = configureServer as ConfigureServerHook;
    },

    async resolveId(id, importer) {
      const path = computedGaliases[id];

      if (!path) {
        message(`Galias "${id}" not found!`, "error");
        message(
          "Please check your Galias configuration (rootDir, relative paths, ...).",
          "warning",
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
