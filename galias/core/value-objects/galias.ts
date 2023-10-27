import { CONSTANTS } from "../../utils/constants";
import { InvalidGaliasError } from "../exceptions/invalid-galias.exception";
import { Prefix } from "./prefix";

/**
 * Galias is a value object that represents a galias (Glob alias) string.
 *
 * @export
 * @class Galias
 * @example
 * const galias = new Galias("{{variable}}/path/to/file");
 * galias.build({ variable: "value" }); // "value/path/to/file"
 * @example
 * const galias = new Galias("path/to/file");
 * galias.build({ variable: "value" }); // "path/to/file"
 */
export class Galias {
  public static INFERED_PRE_VARIABLE_PREFIX = "__pre_";
  public static INFERED_POST_VARIABLE_PREFIX = "__post_";

  constructor(private readonly _value: string) {}

  /**
   * Returns true if the galias contains variables.
   * @example
   * const galias = new Galias("{{variable}}/path/to/file.ext");
   * galiasPath.hasVariables; // true
   * @example
   * const galiasPath = new GaliasPath("path/to/file.ext");
   * galiasPath.hasVariables; // false
   * @readonly
   * @type {boolean}
   * @memberof GaliasPath
   */
  get hasVariables(): boolean {
    return !!this._value.match(CONSTANTS.GALIAS_VARIABLE_REGEXP);
  }

  build(prefix: Prefix, values?: Record<string, string>): string {
    if (!this.hasVariables) {
      return prefix.value + this._value;
    }
    if (!values) {
      const errorMessage = [
        "Something went wrong...",
        `Galias: ${this._value}`,
        "No variable values found.",
      ].join("\n");

      throw new InvalidGaliasError(errorMessage);
    }

    const regexp = new RegExp(CONSTANTS.GALIAS_VARIABLE_REGEXP, "g");

    const galiasWithValues = this._value.replace(regexp, (_match, variable) => {
      return this._assembleInferedVariables(variable, values);
    });

    return prefix.value + galiasWithValues;
  }

  private _assembleInferedVariables(
    variable: string,
    variables: Record<string, string>
  ): string {
    let assembledVariables: string = variables[variable];

    const preVariableKey = Galias.INFERED_PRE_VARIABLE_PREFIX + variable;
    if (variables[preVariableKey]) {
      assembledVariables = variables[preVariableKey] + "/" + assembledVariables;
    }

    const postVariableKey = Galias.INFERED_POST_VARIABLE_PREFIX + variable;
    if (variables[postVariableKey]) {
      assembledVariables += "/" + variables[postVariableKey];
    }

    return assembledVariables;
  }
}
