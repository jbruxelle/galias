import { ResolveSobriquetPathService } from '../../services/resolve-sobriquet-path/resolve-sobriquet-path.service';
import { ComputeSobriquetsInput } from '../../boundaries/compute-sobriquets/compute-sobriquets.input';

import { InferPathsVariablesService } from '../../services/infer-paths-variables/infer-paths-variables.service';
import { PathAdapter } from '../../gateways/path.adapters';
import {
  PicomatchGlobMatchAdapter,
  IsaacsGlobFSAdapter,
  NodePathAdapter,
} from '../../..';
import { GlobFSAdapter } from '../../gateways/glob-fs.adapters';
import { GlobMatchAdapter } from '../../gateways/glob-match.adapter';
import { ComputeSobriquetsUsecase } from './compute-sobriquets.usecase';

describe('USECASE: Compute sobriquets', () => {
  let pathAdapter: PathAdapter;
  let resolveSobriquetPathService: ResolveSobriquetPathService;
  let computeSobriquetsUsecase: ComputeSobriquetsUsecase;
  let globMatchAdapter: GlobMatchAdapter;
  let globFSAdapter: GlobFSAdapter;
  let inferPathsVariablesService: InferPathsVariablesService;

  beforeEach(() => {
    globMatchAdapter = new PicomatchGlobMatchAdapter();
    globFSAdapter = new IsaacsGlobFSAdapter();
    inferPathsVariablesService = new InferPathsVariablesService();
    pathAdapter = new NodePathAdapter();
    resolveSobriquetPathService = new ResolveSobriquetPathService(
      globMatchAdapter,
      globFSAdapter,
      inferPathsVariablesService
    );
    computeSobriquetsUsecase = new ComputeSobriquetsUsecase(
      pathAdapter,
      resolveSobriquetPathService
    );
  });

  it('Should return relative paths with correct prefix ', async () => {
    const input: ComputeSobriquetsInput = {
      sobriquets: {
        'my-sobriquet/{{variable}}': {
          rootDir: '../../samples/compute-sobriquets',
          search: '**/some.file.with.variable.{{variable}}.ts',
          exclude: ['**/*.spec.ts'],
          prefix: '#',
        },
        'my-alias': {
          rootDir: '../../samples/compute-sobriquets',
          prefix: '$',
          exclude: [],
          search: 'folder1/file.ts',
        },
      },
    };

    const expected = {
      '#my-sobriquet/foo':
        '../../samples/compute-sobriquets/fodler2/some.file.with.variable.foo.ts',
      '$my-alias': '../../samples/compute-sobriquets/folder1/file.ts',
    };

    const result = await computeSobriquetsUsecase.execute(input);

    expect(result).toEqual(expected);
  });
});
