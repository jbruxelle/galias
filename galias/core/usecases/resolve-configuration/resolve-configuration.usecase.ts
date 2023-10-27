import { Usecase } from "../../../shared/usecase";
import { ResolveConfigurationInput } from "../../boundaries/resolve-configuration/resolve-configuration.input";
import { ResolveConfigurationOutput } from "../../boundaries/resolve-configuration/resolve-configuration.output";

export class ResolveConfigurationUsecase
  implements Usecase<ResolveConfigurationInput, ResolveConfigurationOutput>
{
  async execute(
    input: ResolveConfigurationInput,
  ): Promise<ResolveConfigurationOutput> {
    const { galiases, adapters, prefix, exclude, rootDir } = input;

    const resolvedConfiguration: ResolveConfigurationOutput = {
      galiases: {},
      adapters: adapters,
    };

    const galiasEntries = Object.entries(galiases);

    for (const [galias, galiasValue] of galiasEntries) {
      if (typeof galiasValue === "string") {
        resolvedConfiguration.galiases[galias] = {
          search: galiasValue,
          prefix,
          exclude,
          rootDir,
        };
      }

      if (typeof galiasValue === "object") {
        resolvedConfiguration.galiases[galias] = {
          search: galiasValue.search,
          prefix: galiasValue.prefix ?? prefix,
          exclude: galiasValue.exclude ?? exclude,
          rootDir: galiasValue.rootDir ?? rootDir,
        };
      }
    }

    return resolvedConfiguration;
  }
}
