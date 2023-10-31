import { Sobriquet } from '../../value-objects/sobriquet';

interface PathWithInferedVariables {
  path: string;
  variables: Record<string, string>;
}

const { INFERED_PRE_VARIABLE_PREFIX, INFERED_POST_VARIABLE_PREFIX } = Sobriquet;

export class InferPathsVariablesService {
  public infer(paths: string[], variables: Record<string, string>) {
    const sections = this._splitInSections(paths, variables);
    const differencesBySection = this._findDifferencesInSections(sections);
    const infered = this._assembleDifferences(differencesBySection, paths);
    return infered;
  }

  /**
   * Splits the paths in sections, where each section is a part of the path before or after a variable.
   * @param paths
   * @param variables
   * @returns
   * @example
   * const paths = ["path/to/file.ext", "path/to/other-file.ext"];
   * const variables = { variable: "to" };
   * const sections = service._splitInSections(paths, variables);
   * sections; // { __pre_variable: [["path"], ["path"]], __post_variable: [["file.ext"], ["other-file.ext"]] }
   * @memberof InferPathVariablesService
   * @private
   * @method
   *
   */
  private _splitInSections(paths: string[], variables: Record<string, string>) {
    const pathSections: Record<string, string[][]> = {};

    for (const path of paths) {
      let _path = path;
      const variablesEntries = Object.entries(variables);
      for (
        let variableIndex = 0;
        variableIndex < variablesEntries.length;
        variableIndex++
      ) {
        const [variableName, variableValue] = variablesEntries[variableIndex];

        const parts = _path.split(variableValue).filter((part) => !!part);
        const preVariableSection = parts.shift() as string;
        const postVariableSection = parts.join(variableValue);

        const preVariableParts = preVariableSection
          .split(/[./]/)
          .filter((part) => !!part);

        const postVariableParts = postVariableSection
          .split(/[./]/)
          .filter((part) => !!part);

        const preVariableKey = INFERED_PRE_VARIABLE_PREFIX + variableName;

        if (pathSections[preVariableKey]) {
          pathSections[preVariableKey].push(preVariableParts);
        } else {
          pathSections[preVariableKey] = [preVariableParts];
        }

        if (variableIndex === variablesEntries.length - 1) {
          const postVariableKey = INFERED_POST_VARIABLE_PREFIX + variableName;

          if (pathSections[postVariableKey]) {
            pathSections[postVariableKey].push(postVariableParts);
          } else {
            pathSections[postVariableKey] = [postVariableParts];
          }
        }

        _path = postVariableSection;
      }
    }

    return pathSections;
  }

  /**
   * Finds the differences in each section.
   * @param sections
   * @returns
   * @example
   * const sections = { __pre_variable: [["path"], ["path"]], __post_variable: [["file.ext"], ["other-file.ext"]] }
   * const differences = service._findDifferencesInSections(sections);
   * differences; // { __pre_variable: [["path"], ["path"]], __post_variable: [["file.ext"], ["other-file.ext"]] }
   * @memberof InferPathVariablesService
   * @private
   * @method
   */
  private _findDifferencesInSections(sections: Record<string, string[][]>) {
    const differences: Record<string, string[][]> = {};

    for (const section in sections) {
      const paths = sections[section];
      for (let pathIndex = 0; pathIndex < paths.length; pathIndex++) {
        const pathParts = paths[pathIndex];

        for (let partIndex = 0; partIndex < pathParts.length; partIndex++) {
          const part = pathParts[partIndex];
          const sectionPathOriginParts = new Set(pathParts.slice(0, partIndex));
          const pathSectionWithSameOrigin = paths.filter(
            (_sectionPathParts) => {
              const _sectionPathOriginParts = _sectionPathParts.slice(
                0,
                partIndex
              );

              return _sectionPathOriginParts.every((_part) =>
                sectionPathOriginParts.has(_part)
              );
            }
          );

          const hasDifference = pathSectionWithSameOrigin.some(
            (_pathSectionParts) => !_pathSectionParts.includes(part)
          );

          if (hasDifference) {
            if (!differences[section]) {
              differences[section] = [];
            }
            if (!differences[section][pathIndex]) {
              differences[section][pathIndex] = [];
            }
            differences[section][pathIndex].push(part);
          }
        }
      }
    }

    return differences;
  }

  /**
   *
   * @param differences
   * @param paths
   * @returns
   * @example
   * const differences = { __pre_variable: [["some"], []], __post_variable: [["file.ext"], ["other-file.ext"]] }
   * const paths = ["some/path/to/file.ext", "path/to/other-file.ext"];
   * const infered = service._assembleDifferences(differences, paths);
   * infered; // [{ path: "path/to/file.ext", variables: { __pre_variable: "path", __post_variable: "file.ext" } }, { path: "path/to/other-file.ext", variables: { __pre_variable: "path", __post_variable: "other-file.ext" } }]
   */
  private _assembleDifferences(
    differences: Record<string, string[][]>,
    paths: string[]
  ) {
    const result: PathWithInferedVariables[] = [];

    for (const [pathIndex, path] of paths.entries()) {
      const difference: Record<string, string> = {};
      for (const section in differences) {
        const sectionDifferences = differences[section];
        const sectionDifference = sectionDifferences[pathIndex];

        if (sectionDifference?.length > 0) {
          difference[section] = sectionDifference.join('/');
        }
      }

      result.push({ path, variables: difference });
    }

    return result;
  }
}
