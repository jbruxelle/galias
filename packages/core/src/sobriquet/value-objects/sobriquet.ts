import { CONSTANTS } from '../../constants';
import { InvalidSobriquetError } from '../exceptions/invalid-sobriquet.exception';
import { Prefix } from './prefix';

/**
 * Sobriquet is a value object that represents a sobriquet (Glob alias) string.
 *
 * @export
 * @class Sobriquet
 * @example
 * const sobriquet = new Sobriquet("{{variable}}/path/to/file");
 * sobriquet.build({ variable: "value" }); // "value/path/to/file"
 * @example
 * const sobriquet = new Sobriquet("path/to/file");
 * sobriquet.build({ variable: "value" }); // "path/to/file"
 */
export class Sobriquet {
  public static INFERED_PRE_VARIABLE_PREFIX = '__pre_';
  public static INFERED_POST_VARIABLE_PREFIX = '__post_';

  constructor(private readonly _value: string) {}

  /**
   * Returns true if the sobriquet contains variables.
   * @example
   * const sobriquet = new Sobriquet("{{variable}}/path/to/file.ext");
   * sobriquetPath.hasVariables; // true
   * @example
   * const sobriquetPath = new SobriquetPath("path/to/file.ext");
   * sobriquetPath.hasVariables; // false
   * @readonly
   * @type {boolean}
   * @memberof SobriquetPath
   */
  get hasVariables(): boolean {
    return CONSTANTS.SOBRIQUET_VARIABLE_REGEXP.test(this._value);
  }

  build(prefix: Prefix, values?: Record<string, string>): string {
    if (!this.hasVariables) {
      return prefix.value + this._value;
    }
    if (!values) {
      const errorMessage = [
        'Something went wrong...',
        `Sobriquet: ${this._value}`,
        'No variable values found.',
      ].join('\n');

      throw new InvalidSobriquetError(errorMessage);
    }

    const regexp = new RegExp(CONSTANTS.SOBRIQUET_VARIABLE_REGEXP, 'g');

    const sobriquetWithValues = this._value.replace(
      regexp,
      (_match, variable) => {
        return this._assembleInferedVariables(variable, values);
      }
    );

    return prefix.value + sobriquetWithValues;
  }

  private _assembleInferedVariables(
    variable: string,
    variables: Record<string, string>
  ): string {
    let assembledVariables: string = variables[variable];

    const preVariableKey = Sobriquet.INFERED_PRE_VARIABLE_PREFIX + variable;
    if (variables[preVariableKey]) {
      assembledVariables = variables[preVariableKey] + '/' + assembledVariables;
    }

    const postVariableKey = Sobriquet.INFERED_POST_VARIABLE_PREFIX + variable;
    if (variables[postVariableKey]) {
      assembledVariables += '/' + variables[postVariableKey];
    }

    return assembledVariables;
  }
}
