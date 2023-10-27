import { CONSTANTS } from "../../utils/constants";
import { InvalidGaliasPathError } from "../exceptions/invalid-galias-path.exception";

/**
 * GaliasPath is a value object that represents a galias (Glob alias) path string.
 *
 * @export
 * @class GaliasPath
 * @example
 * const galiasPath = new GaliasPath("{{variable}}/path/to/file.ext");
 * galiasPath.value; // "{{variable}}/path/to/file.ext"
 * galiasPath.hasVariables; // true
 * galiasPath.glob; // "*\/path/to/file.ext"
 * galiasPath.regexpVariablesPath; // "(?<variable>[^\\/.]*)/path/to/file.ext"
 * @example
 * const galiasPath = new GaliasPath("path/to/file.ext");
 * galiasPath.value; // "path/to/file.ext"
 * galiasPath.hasVariables; // false
 * galiasPath.glob; // "path/to/file.ext"
 * galiasPath.regexpVariablesPath; // "path/to/file.ext"
 */
export class GaliasPath {
  constructor(private readonly _value: string) {
    this._validate();
  }

  public static globFrom(value: string): string {
    return new GaliasPath(value).glob;
  }

  /**
   * Returns the original string.
   * @example
   * const galiasPath = new GaliasPath("{{variable}}/path/to/file.ext");
   * galiasPath.value; // "{{variable}}/path/to/file.ext"
   * @readonly
   * @type {string}
   * @memberof GaliasPath
   */
  get value(): string {
    return this._value;
  }

  /**
   * Returns a string with the variables replaced by a glob pattern.
   * @example
   * const galiasPath = new GaliasPath("{{variable}}/path/to/file.ext");
   * galiasPath.toGlobPattern(); // "*\/path/to/file.ext"
   * @readonly
   * @type {string}
   * @memberof GaliasPath
   */
  get glob(): string {
    return this._toGlobPattern();
  }

  /**
   * Returns a string with the variables replaced by a regexp named capture group.
   * @example
   * const galiasPath = new GaliasPath("{{variable}}/path/to/file.ext");
   * galiasPath.regexpVariablesPath; // "(?<variable>[^\\/.]*)/path/to/file.ext"
   * @readonly
   * @type {string}
   * @memberof GaliasPath
   */
  get regexpVariablesPath(): string {
    return this._variablesToRegexp();
  }

  /**
   * Returns true if the path contains variables.
   * @example
   * const galiasPath = new GaliasPath("{{variable}}/path/to/file.ext");
   * galiasPath.hasVariables; // true
   * @example
   * const galiasPath = new GaliasPath("path/to/file.ext");
   * galiasPath.hasVariables; // false
   * @readonly
   * @type {boolean}
   * @memberof GaliasPath
   */
  get hasVariables(): boolean {
    return CONSTANTS.GALIAS_VARIABLE_REGEXP.test(this._value);
  }

  private _toGlobPattern(): string {
    return this._value.replace(CONSTANTS.GALIAS_VARIABLE_REGEXP, "*");
  }

  private _variablesToRegexp(): string {
    const replacedVariables: string[] = [];

    return this.value.replace(
      CONSTANTS.GALIAS_VARIABLE_REGEXP,
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
    if (this._value.includes("//")) {
      throw new InvalidGaliasPathError(
        "Galias path cannot contain double slashes"
      );
    }

    if (this._value.includes("\\\\")) {
      throw new InvalidGaliasPathError(
        "Galias path cannot contain double backslashes"
      );
    }

    if (this.value.includes("!")) {
      throw new InvalidGaliasPathError(
        "Galias path cannot contain negation, use exclude instead"
      );
    }
  }
}
