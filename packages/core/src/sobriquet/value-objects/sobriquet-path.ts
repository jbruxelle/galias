import { CONSTANTS } from '../../constants';
import { InvalidSobriquetPathError } from '../exceptions/invalid-sobriquet-path.exception';

/**
 * SobriquetPath is a value object that represents a sobriquet (Glob alias) path string.
 *
 * @export
 * @class SobriquetPath
 * @example
 * const sobriquetPath = new SobriquetPath("{{variable}}/path/to/file.ext");
 * sobriquetPath.value; // "{{variable}}/path/to/file.ext"
 * sobriquetPath.hasVariables; // true
 * sobriquetPath.glob; // "*\/path/to/file.ext"
 * sobriquetPath.regexpVariablesPath; // "(?<variable>[^\\/.]*)/path/to/file.ext"
 * @example
 * const sobriquetPath = new SobriquetPath("path/to/file.ext");
 * sobriquetPath.value; // "path/to/file.ext"
 * sobriquetPath.hasVariables; // false
 * sobriquetPath.glob; // "path/to/file.ext"
 * sobriquetPath.regexpVariablesPath; // "path/to/file.ext"
 */
export class SobriquetPath {
  constructor(private readonly _value: string) {
    this._validate();
  }

  public static globFrom(value: string): string {
    return new SobriquetPath(value).glob;
  }

  /**
   * Returns the original string.
   * @example
   * const sobriquetPath = new SobriquetPath("{{variable}}/path/to/file.ext");
   * sobriquetPath.value; // "{{variable}}/path/to/file.ext"
   * @readonly
   * @type {string}
   * @memberof SobriquetPath
   */
  get value(): string {
    return this._value;
  }

  /**
   * Returns a string with the variables replaced by a glob pattern.
   * @example
   * const sobriquetPath = new SobriquetPath("{{variable}}/path/to/file.ext");
   * sobriquetPath.toGlobPattern(); // "*\/path/to/file.ext"
   * @readonly
   * @type {string}
   * @memberof SobriquetPath
   */
  get glob(): string {
    return this._toGlobPattern();
  }

  /**
   * Returns a string with the variables replaced by a regexp named capture group.
   * @example
   * const sobriquetPath = new SobriquetPath("{{variable}}/path/to/file.ext");
   * sobriquetPath.regexpVariablesPath; // "(?<variable>[^\\/.]*)/path/to/file.ext"
   * @readonly
   * @type {string}
   * @memberof SobriquetPath
   */
  get regexpVariablesPath(): string {
    return this._variablesToRegexp();
  }

  /**
   * Returns true if the path contains variables.
   * @example
   * const sobriquetPath = new SobriquetPath("{{variable}}/path/to/file.ext");
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

  private _toGlobPattern(): string {
    return this._value.replace(CONSTANTS.SOBRIQUET_VARIABLE_REGEXP, '*');
  }

  private _variablesToRegexp(): string {
    const replacedVariables: string[] = [];

    return this.value.replace(
      CONSTANTS.SOBRIQUET_VARIABLE_REGEXP,
      (_match, variable) => {
        if (!replacedVariables.includes(variable)) {
          replacedVariables.push(variable);
          return `(?<${variable}>[^\\/.][\\w-]+)`;
        }
        return `\\k<${variable}>`;
      }
    );
  }

  private _validate(): void {
    if (this._value.includes('//')) {
      throw new InvalidSobriquetPathError(
        'Sobriquet path cannot contain double slashes'
      );
    }

    if (this._value.includes('\\\\')) {
      throw new InvalidSobriquetPathError(
        'Sobriquet path cannot contain double backslashes'
      );
    }

    if (this.value.includes('!')) {
      throw new InvalidSobriquetPathError(
        'Sobriquet path cannot contain negation, use exclude instead'
      );
    }
  }
}
