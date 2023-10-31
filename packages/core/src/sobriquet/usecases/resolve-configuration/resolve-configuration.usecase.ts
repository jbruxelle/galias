import { JSConfigAdapter, TSConfigAdapter } from '../../..';
import { Usecase } from '../../../types/usecase';
import { ResolveConfigurationInput } from '../../boundaries/resolve-configuration/resolve-configuration.input';
import { ResolveConfigurationOutput } from '../../boundaries/resolve-configuration/resolve-configuration.output';
import { LanguageConfigurationAdapter } from '../../gateways/language-configuration.adapter';
import { LanguageOption } from '../../plugin/plugin.options.language';

export class ResolveConfigurationUsecase
  implements Usecase<ResolveConfigurationInput, ResolveConfigurationOutput>
{
  async execute(
    input: ResolveConfigurationInput
  ): Promise<ResolveConfigurationOutput> {
    const { sobriquets, prefix, exclude, rootDir, tsconfig, jsconfig } = input;

    const languageConfigurationAdapters =
      this._inferLanguageConfigurationAdapters(tsconfig, jsconfig);

    const resolvedConfiguration: ResolveConfigurationOutput = {
      sobriquets: {},
      languageConfigurationAdapters,
    };

    const sobriquetsEntries = Object.entries(sobriquets);

    for (const [sobriquet, sobriquetValue] of sobriquetsEntries) {
      if (typeof sobriquetValue === 'string') {
        resolvedConfiguration.sobriquets[sobriquet] = {
          search: sobriquetValue,
          prefix,
          exclude,
          rootDir,
        };
      }

      if (typeof sobriquetValue === 'object') {
        resolvedConfiguration.sobriquets[sobriquet] = {
          search: sobriquetValue.search,
          prefix: sobriquetValue.prefix ?? prefix,
          exclude: sobriquetValue.exclude ?? exclude,
          rootDir: sobriquetValue.rootDir ?? rootDir,
        };
      }
    }

    return await Promise.resolve(resolvedConfiguration);
  }

  private _inferLanguageConfigurationAdapters(
    tsconfig?: boolean | LanguageOption,
    jsconfig?: boolean | LanguageOption
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
