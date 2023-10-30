import { ResolveGaliasPathService } from '../../services/resolve-galias-path/resolve-galias-path.service';
import { ComputeGaliasesInput } from '../../boundaries/compute-galiases/compute-galiases.input';

import { InferPathsVariablesService } from '../../services/infer-paths-variables/infer-paths-variables.service';
import { PathAdapter } from '../../gateways/path.adapters';
import {
  PicomatchGlobMatchAdapter,
  IsaacsGlobFSAdapter,
  NodePathAdapter,
} from '../../..';
import { GlobFSAdapter } from '../../gateways/glob-fs.adapters';
import { GlobMatchAdapter } from '../../gateways/glob-match.adapter';
import { ComputeGaliasesUsecase } from './compute-galiases.usecase';

describe('USECASE: Compute galiases', () => {
  let pathAdapter: PathAdapter;
  let resolveGaliasPathService: ResolveGaliasPathService;
  let computeGaliasesUsecase: ComputeGaliasesUsecase;
  let globMatchAdapter: GlobMatchAdapter;
  let globFSAdapter: GlobFSAdapter;
  let inferPathsVariablesService: InferPathsVariablesService;

  beforeEach(() => {
    globMatchAdapter = new PicomatchGlobMatchAdapter();
    globFSAdapter = new IsaacsGlobFSAdapter();
    inferPathsVariablesService = new InferPathsVariablesService();
    pathAdapter = new NodePathAdapter();
    resolveGaliasPathService = new ResolveGaliasPathService(
      globMatchAdapter,
      globFSAdapter,
      inferPathsVariablesService
    );
    computeGaliasesUsecase = new ComputeGaliasesUsecase(
      pathAdapter,
      resolveGaliasPathService
    );
  });

  it('Should return relative paths with correct prefix ', async () => {
    const input: ComputeGaliasesInput = {
      galiases: {
        'my-galias/{{variable}}': {
          rootDir: '../../samples/compute-galiases',
          search: '**/some.file.with.variable.{{variable}}.ts',
          exclude: ['**/*.spec.ts'],
          prefix: '#',
        },
        'my-alias': {
          rootDir: '../../samples/compute-galiases',
          prefix: '$',
          exclude: [],
          search: 'folder1/file.ts',
        },
      },
    };

    const expected = {
      '#my-galias/foo':
        '../../samples/compute-galiases/fodler2/some.file.with.variable.foo.ts',
      '$my-alias': '../../samples/compute-galiases/folder1/file.ts',
    };

    const result = await computeGaliasesUsecase.execute(input);

    expect(result).toEqual(expected);
  });
});
