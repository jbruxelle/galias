import { Usecase } from '../../../types/usecase';
import { ComputeGaliasesInput } from '../../boundaries/compute-galiases/compute-galiases.input';
import { ComputeGaliasesOutput } from '../../boundaries/compute-galiases/compute-galiases.output';
import { PathAdapter } from '../../gateways/path.adapters';
import { ResolveGaliasPathService } from '../../services/resolve-galias-path/resolve-galias-path.service';
import { Galias } from '../../value-objects/galias';
import { GaliasPath } from '../../value-objects/galias-path';
import { Prefix } from '../../value-objects/prefix';

export class ComputeGaliasesUsecase
  implements Usecase<ComputeGaliasesInput, ComputeGaliasesOutput>
{
  constructor(
    private readonly _pathAdapter: PathAdapter,
    private readonly _resolveGaliasPathService: ResolveGaliasPathService
  ) {}

  async execute(input: ComputeGaliasesInput): Promise<ComputeGaliasesOutput> {
    const { galiases: galiasesRecord } = input;

    if (!galiasesRecord) return {};

    let result: Record<string, string> = {};

    const galiasesRecordEntries = Object.entries(galiasesRecord);

    for (const [alias, path] of galiasesRecordEntries) {
      const { search, rootDir, exclude, prefix: stringPrefix } = path;
      const prefix = new Prefix(stringPrefix);
      const pathWithRootDir = this._pathAdapter.posixJoin(rootDir, search);
      const galias = new Galias(alias);
      const galiasPath = new GaliasPath(pathWithRootDir);

      const resolvedGaliasPath = await this._resolveGaliasPathService.resolve(
        galiasPath,
        exclude
      );

      for (const resolvedGaliasPathMatch of resolvedGaliasPath) {
        const { path: resolvedPath, variables } = resolvedGaliasPathMatch;
        const relativeResolvedPath = this._pathAdapter.relativePosix(
          './',
          resolvedPath
        );
        const assembledGalias = galias.build(prefix, variables);
        result = {
          ...result,
          [assembledGalias]: relativeResolvedPath,
        };
      }
    }

    return result;
  }
}
