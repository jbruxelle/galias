import { readFile, writeFile } from "fs/promises";
import {
  LanguageConfigurationAdapter,
  LanguageConfigurationAdapterOptions,
} from "../../galias/gateways/language-configuration.adapter";

export abstract class BaseLanguageConfigurationAdapter
  implements LanguageConfigurationAdapter
{
  constructor(
    private readonly _name: string,
    private readonly _configFileName: string,
    private readonly _options?: LanguageConfigurationAdapterOptions,
  ) {}

  get name(): string {
    return this._name;
  }

  get configFileName(): string {
    return this._configFileName;
  }

  get defaultSource(): string {
    return `./${this._configFileName}`;
  }

  get source(): string {
    return this._options?.source ?? this.defaultSource;
  }

  get output(): string {
    return this._options?.output ?? this.defaultSource;
  }

  async resolve(): Promise<Record<string, any>> {
    const configurationBuffer = await readFile(this.source);
    const configurationString = configurationBuffer.toString();
    return JSON.parse(this._ignoreComments(configurationString));
  }

  async consume(computedPaths: Record<string, string>): Promise<void> {
    const configuration = await this.resolve();

    const compilerOptions = configuration["compilerOptions"];
    const paths = compilerOptions["paths"];
    const transformedComputedPaths = this._formatComputedPaths(computedPaths);

    const updatedConfiguration = {
      ...configuration,
      compilerOptions: {
        ...compilerOptions,
        paths: { ...paths, ...transformedComputedPaths },
      },
    };

    const updatedConfigurationString = JSON.stringify(
      updatedConfiguration,
      null,
      2,
    );

    await writeFile(this.output, updatedConfigurationString);
  }

  private _formatComputedPaths(
    computedPaths: Record<string, string>,
  ): Record<string, string[]> {
    const entries = Object.entries(computedPaths);
    const transformedEntries = entries.map(([key, value]) => [key, [value]]);
    return Object.fromEntries(transformedEntries);
  }

  private _ignoreComments(content: string): string {
    return content.replace(
      /\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g,
      (match, g) => (g ? "" : match),
    );
  }
}
