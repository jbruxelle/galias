import { InvalidGaliasPathError } from "../../exceptions/invalid-galias-path.exception";
import { GaliasPath } from "../../value-objects/galias-path";
import { GlobFSAdapter } from "../../gateways/glob-fs.adapters";
import { GlobMatchAdapter } from "../../gateways/glob-match.adapter";
import { InferPathsVariablesService } from "../infer-paths-variables/infer-paths-variables.service";

export type ResolvedGaliasPathMatch = {
  path: string;
  variables?: Record<string, string>;
};

type ResolvedGaliasPathConflict = {
  paths: string[];
  variables: Record<string, string>;
};

export class ResolveGaliasPathService {
  constructor(
    private readonly _globMatchAdapter: GlobMatchAdapter,
    private readonly _globFSAdapter: GlobFSAdapter,
    private readonly _inferPathsVariablesService: InferPathsVariablesService,
  ) {}

  /**
   *
   * @param galiasPath {GaliasPath}
   * @returns Promise<ResolvedGaliasPath>
   * @memberof ResolveGaliasPathService
   * @example
   * ```typescript
   * const galiasPath = new GaliasPath("{{myVariable}}/path/to/*.ext");
   * const resolved = await service.resolve(galiasPath);
   * resolved; // [{ path: "some/path/to/file.ext", variables: { myVariable: "some", __infered__: "file"  } }, { path: "some/path/to/other-file.ext", variables: { myVariable: "some", __infered__: "other-file" } }"}]
   * ```
   * @example
   * const galiasPath = new GaliasPath("path/to/file.ext");
   * const resolved = await service.resolve(galiasPath);
   * resolved; // [{ path: "path/to/file.ext" }]
   *
   */
  async resolve(
    galiasPath: GaliasPath,
    exclude: string[] = [],
  ): Promise<ResolvedGaliasPathMatch[]> {
    if (!galiasPath.value) {
      return [];
    }

    const isGlob = this._globMatchAdapter.isGlob(galiasPath.value);
    const hasVariables = galiasPath.hasVariables;

    if (!hasVariables && !isGlob) {
      return [{ path: galiasPath.value }];
    }

    if (isGlob && !hasVariables) {
      const errorMessage = [
        "Glob path without variables cannot be resolved to a single path.",
        "Make sure to use variables or not to use glob. ",
        "Path: ${galiasPath.value",
      ].join("\n");

      throw new InvalidGaliasPathError(errorMessage);
    }

    const matches = await this._globFSAdapter.find(galiasPath.glob, exclude);
    const regexp = this._globMatchAdapter.toRegexp(
      galiasPath.regexpVariablesPath,
    );

    const resolvedPathMatches: ResolvedGaliasPathMatch[] = [];

    for (const path of matches) {
      const match = regexp.exec(path);
      const groups = match?.groups;

      if (!groups) continue;

      resolvedPathMatches.push({ path: path, variables: match?.groups });
    }

    const conflicts = this._findResolvedPathConflicts(resolvedPathMatches);

    if (conflicts.length === 0) {
      return resolvedPathMatches;
    }

    return this._settleResolvedPathsConflicts(conflicts);
  }

  private _findResolvedPathConflicts(
    matches: ResolvedGaliasPathMatch[],
  ): ResolvedGaliasPathConflict[] {
    const serializedVariablesSets = matches.map((match) => {
      return JSON.stringify(match.variables);
    });

    const uniqueSerializedVariables = [...new Set(serializedVariablesSets)];

    if (uniqueSerializedVariables.length === matches.length) {
      return [];
    }

    const conflicts: ResolvedGaliasPathConflict[] = [];

    for (const variables of uniqueSerializedVariables) {
      const paths = matches
        .filter((match) => JSON.stringify(match.variables) === variables)
        .map((match) => match.path);

      conflicts.push({ variables: JSON.parse(variables), paths });
    }

    return conflicts;
  }

  private _settleResolvedPathsConflicts(
    conflicts: ResolvedGaliasPathConflict[],
  ) {
    const settled: ResolvedGaliasPathMatch[] = [];

    for (const conflict of conflicts) {
      const { variables, paths } = conflict;

      if (paths.length === 1) {
        settled.push({ path: paths[0], variables });
        continue;
      }

      const pathsWithInferedVariables = this._inferPathsVariablesService.infer(
        paths,
        variables,
      );

      const settledPaths = pathsWithInferedVariables.map(
        ({ path, variables: inferedVariables }) => {
          const settledVariables = {
            ...variables,
            ...inferedVariables,
          };
          return { path, variables: settledVariables };
        },
      );

      settled.push(...settledPaths);
    }

    return settled;
  }
}
