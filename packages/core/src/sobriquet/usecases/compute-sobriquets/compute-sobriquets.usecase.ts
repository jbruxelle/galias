import { Usecase } from '../../../types/usecase';
import { ComputeSobriquetsInput } from '../../boundaries/compute-sobriquets/compute-sobriquets.input';
import { ComputeSobriquetsOutput } from '../../boundaries/compute-sobriquets/compute-sobriquets.output';
import { PathAdapter } from '../../gateways/path.adapters';
import { ResolveSobriquetPathService } from '../../services/resolve-sobriquet-path/resolve-sobriquet-path.service';
import { Sobriquet } from '../../value-objects/sobriquet';
import { SobriquetPath } from '../../value-objects/sobriquet-path';
import { Prefix } from '../../value-objects/prefix';

export class ComputeSobriquetsUsecase
  implements Usecase<ComputeSobriquetsInput, ComputeSobriquetsOutput>
{
  constructor(
    private readonly _pathAdapter: PathAdapter,
    private readonly _resolveSobriquetPathService: ResolveSobriquetPathService
  ) {}

  async execute(
    input: ComputeSobriquetsInput
  ): Promise<ComputeSobriquetsOutput> {
    const { sobriquets: sobriquetsRecord } = input;

    if (!sobriquetsRecord) {
      return {};
    }

    let result: Record<string, string> = {};

    const sobriquetsRecordEntries = Object.entries(sobriquetsRecord);

    for (const [alias, path] of sobriquetsRecordEntries) {
      const { search, rootDir, exclude, prefix: stringPrefix } = path;
      const prefix = new Prefix(stringPrefix);
      const pathWithRootDir = this._pathAdapter.posixJoin(rootDir, search);
      const sobriquet = new Sobriquet(alias);
      const sobriquetPath = new SobriquetPath(pathWithRootDir);

      const resolvedSobriquetPath =
        await this._resolveSobriquetPathService.resolve(sobriquetPath, exclude);

      for (const resolvedSobriquetPathMatch of resolvedSobriquetPath) {
        const { path: resolvedPath, variables } = resolvedSobriquetPathMatch;
        const fullResolvedPath = this._pathAdapter.relativePosix(
          './',
          resolvedPath
        );

        const isRelative = fullResolvedPath.startsWith('.');
        const relativeResolvedPath = isRelative
          ? fullResolvedPath
          : `./${fullResolvedPath}`;

        const assembledSobriquet = sobriquet.build(prefix, variables);
        result = {
          ...result,
          [assembledSobriquet]: relativeResolvedPath,
        };
      }
    }

    return result;
  }
}
