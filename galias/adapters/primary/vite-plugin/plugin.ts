import { normalizePath, type Plugin, type ViteDevServer } from "vite";
import {
  default as watchAndRun,
  Options as WatchAndRunOptions,
} from "vite-plugin-watch-and-run";

import { resolve } from "path";
import { ResolveConfigurationInput } from "../../../core/boundaries/resolve-configuration/resolve-configuration.input";
import { ResolveConfigurationOutput } from "../../../core/boundaries/resolve-configuration/resolve-configuration.output";
import { InferPathsVariablesService } from "../../../core/services/infer-paths-variables/infer-paths-variables.service";
import { ResolveGaliasPathService } from "../../../core/services/resolve-galias-path/resolve-galias-path.service";
import { ComputeGaliasesUsecase } from "../../../core/usecases/compute-galiases/compute-galiases.usecase";
import { ConsumeGaliasesUsecase } from "../../../core/usecases/consume-galiases/consume-galiases.usecase";
import { ResolveConfigurationUsecase } from "../../../core/usecases/resolve-configuration/resolve-configuration.usecase";
import { GaliasPath } from "../../../core/value-objects/galias-path";
import { createMessage } from "../../../utils/message";
import { IsaacsGlobFSAdapter } from "../../secondary/gateways/glob-fs/isaacs.glob-fs.adapters";
import { PicomatchGlobMatchAdapter } from "../../secondary/gateways/glob-match/picomatch.glob-match.adapter";
import { NodePathAdapter } from "../../secondary/gateways/path/node.path.adapter";
import { VitePluginGaliasOptions } from "./options";

type ConfigureServerHook = (server: ViteDevServer) => Promise<() => void>;

export default (options: VitePluginGaliasOptions): Plugin => {
  let watchAndRunConfigureServer: ConfigureServerHook;
  let computedGaliases: Record<string, string> = {};

  const globMatchAdapter = new PicomatchGlobMatchAdapter();
  const globFSAdapter = new IsaacsGlobFSAdapter();
  const pathAdapter = new NodePathAdapter();
  const inferPathsVariablesService = new InferPathsVariablesService();
  const resolveGaliasPathService = new ResolveGaliasPathService(
    globMatchAdapter,
    globFSAdapter,
    inferPathsVariablesService
  );

  const resolveConfigurationUsecase = new ResolveConfigurationUsecase();

  const computeGaliasesUsecase = new ComputeGaliasesUsecase(
    pathAdapter,
    resolveGaliasPathService
  );

  const consumeGaliasesUsecase = new ConsumeGaliasesUsecase();

  const message = createMessage(options.logs);

  const runGalias = async (configuration: ResolveConfigurationOutput) => {
    computedGaliases = await computeGaliasesUsecase.execute({
      galiases: configuration.galiases,
    });

    await consumeGaliasesUsecase.execute({
      configurationAdapters: configuration.adapters,
      paths: computedGaliases,
    });

    message("Galiases updated!", "info");
  };

  return {
    name: "vite-plugin-galias",
    async configResolved() {
      const defaultOptions: ResolveConfigurationInput = {
        prefix: "$",
        rootDir: "./",
        exclude: [],
        galiases: {},
        adapters: [],
      };

      const mergedOptions: ResolveConfigurationInput = {
        ...defaultOptions,
        ...options,
      };

      const resolvedConfiguration = await resolveConfigurationUsecase.execute(
        mergedOptions
      );

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
          "warning"
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
