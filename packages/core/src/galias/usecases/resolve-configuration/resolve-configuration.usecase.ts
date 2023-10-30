import { JSConfigAdapter, TSConfigAdapter } from "../../..";
import { Usecase } from "../../../types/usecase";
import { ResolveConfigurationInput } from "../../boundaries/resolve-configuration/resolve-configuration.input";
import { ResolveConfigurationOutput } from "../../boundaries/resolve-configuration/resolve-configuration.output";
import { LanguageConfigurationAdapter } from "../../gateways/language-configuration.adapter";
import { LanguageOption } from "../../plugin/plugin.options.language";

export class ResolveConfigurationUsecase
  implements Usecase<ResolveConfigurationInput, ResolveConfigurationOutput>
{
  async execute(
    input: ResolveConfigurationInput,
  ): Promise<ResolveConfigurationOutput> {
    const { galiases, prefix, exclude, rootDir, tsconfig, jsconfig } = input;

    const languageConfigurationAdapters =
      this._inferLanguageConfigurationAdapters(tsconfig, jsconfig);

    const resolvedConfiguration: ResolveConfigurationOutput = {
      galiases: {},
      languageConfigurationAdapters,
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

  private _inferLanguageConfigurationAdapters(
    tsconfig?: boolean | LanguageOption,
    jsconfig?: boolean | LanguageOption,
  ): LanguageConfigurationAdapter[] {
    const adapters: LanguageConfigurationAdapter[] = [];

    if (tsconfig) {
      const options = tsconfig === true ? undefined : tsconfig;
      adapters.push(new TSConfigAdapter(options));
    }
    if (jsconfig) {
      const options = jsconfig === true ? undefined : jsconfig;
      adapters.push(new JSConfigAdapter(options));
    }

    return adapters;
  }
}
