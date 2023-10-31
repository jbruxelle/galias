import { InvalidSobriquetPathError } from '../../exceptions/invalid-sobriquet-path.exception';
import { SobriquetPath } from '../../value-objects/sobriquet-path';
import { GlobFSAdapter } from '../../gateways/glob-fs.adapters';
import { GlobMatchAdapter } from '../../gateways/glob-match.adapter';
import { InferPathsVariablesService } from '../infer-paths-variables/infer-paths-variables.service';

export type ResolvedSobriquetPathMatch = {
  path: string;
  variables?: Record<string, string>;
};

type ResolvedSobriquetPathConflict = {
  paths: string[];
  variables: Record<string, string>;
};

export class ResolveSobriquetPathService {
  constructor(
    private readonly _globMatchAdapter: GlobMatchAdapter,
    private readonly _globFSAdapter: GlobFSAdapter,
    private readonly _inferPathsVariablesService: InferPathsVariablesService
  ) {}

  /**
   *
   * @param sobriquetPath {SobriquetPath}
   * @returns Promise<ResolvedSobriquetPath>
   * @memberof ResolveSobriquetPathService
   * @example
   * ```typescript
   * const sobriquetPath = new SobriquetPath("{{myVariable}}/path/to/*.ext");
   * const resolved = await service.resolve(sobriquetPath);
   * resolved; // [{ path: "some/path/to/file.ext", variables: { myVariable: "some", __infered__: "file"  } }, { path: "some/path/to/other-file.ext", variables: { myVariable: "some", __infered__: "other-file" } }"}]
   * ```
   * @example
   * const sobriquetPath = new SobriquetPath("path/to/file.ext");
   * const resolved = await service.resolve(sobriquetPath);
   * resolved; // [{ path: "path/to/file.ext" }]
   *
   */
  async resolve(
    sobriquetPath: SobriquetPath,
    exclude: string[] = []
  ): Promise<ResolvedSobriquetPathMatch[]> {
    if (!sobriquetPath.value) {
      return [];
    }

    const isGlob = this._globMatchAdapter.isGlob(sobriquetPath.value);
    const hasVariables = sobriquetPath.hasVariables;

    if (!hasVariables && !isGlob) {
      return [{ path: sobriquetPath.value }];
    }

    if (isGlob && !hasVariables) {
      const errorMessage = [
        'Glob path without variables cannot be resolved to a single path.',
        'Make sure to use variables or not to use glob. ',
        `Path: ${sobriquetPath.value}`,
      ].join('\n');

      throw new InvalidSobriquetPathError(errorMessage);
    }

    // eslint-disable-next-line unicorn/no-array-method-this-argument
    const matches = await this._globFSAdapter.find(sobriquetPath.glob, exclude);
    const regexp = this._globMatchAdapter.toRegexp(
      sobriquetPath.regexpVariablesPath
    );

    const resolvedPathMatches: ResolvedSobriquetPathMatch[] = [];

    for (const path of matches) {
      const match = regexp.exec(path);
      const groups = match?.groups;

      if (!groups) {
        continue;
      }

      resolvedPathMatches.push({ path, variables: match?.groups });
    }

    const conflicts = this._findResolvedPathConflicts(resolvedPathMatches);

    if (conflicts.length === 0) {
      return resolvedPathMatches;
    }

    return this._settleResolvedPathsConflicts(conflicts);
  }

  private _findResolvedPathConflicts(
    matches: ResolvedSobriquetPathMatch[]
  ): ResolvedSobriquetPathConflict[] {
    const serializedVariablesSets = matches.map((match) => {
      return JSON.stringify(match.variables);
    });

    const uniqueSerializedVariables = [...new Set(serializedVariablesSets)];

    if (uniqueSerializedVariables.length === matches.length) {
      return [];
    }

    const conflicts: ResolvedSobriquetPathConflict[] = [];

    for (const variables of uniqueSerializedVariables) {
      const paths = matches
        .filter((match) => JSON.stringify(match.variables) === variables)
        .map((match) => match.path);

      conflicts.push({ variables: JSON.parse(variables), paths });
    }

    return conflicts;
  }

  private _settleResolvedPathsConflicts(
    conflicts: ResolvedSobriquetPathConflict[]
  ) {
    const settled: ResolvedSobriquetPathMatch[] = [];

    for (const conflict of conflicts) {
      const { variables, paths } = conflict;

      if (paths.length === 1) {
        settled.push({ path: paths[0], variables });
        continue;
      }

      const pathsWithInferedVariables = this._inferPathsVariablesService.infer(
        paths,
        variables
      );

      const settledPaths = pathsWithInferedVariables.map(
        ({ path, variables: inferedVariables }) => {
          const settledVariables = {
            ...variables,
            ...inferedVariables,
          };
          return { path, variables: settledVariables };
        }
      );

      settled.push(...settledPaths);
    }

    return settled;
  }
}
