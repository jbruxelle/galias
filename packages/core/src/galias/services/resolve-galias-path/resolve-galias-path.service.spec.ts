import { IsaacsGlobFSAdapter } from '../../../adapters/glob-fs/isaacs.glob-fs.adapters';
import { PicomatchGlobMatchAdapter } from '../../../adapters/glob-match/picomatch.glob-match.adapter';
import { InvalidGaliasPathError } from '../../exceptions/invalid-galias-path.exception';
import { GaliasPath } from '../../value-objects/galias-path';
import { InferPathsVariablesService } from '../infer-paths-variables/infer-paths-variables.service';
import {
  ResolveGaliasPathService,
  ResolvedGaliasPathMatch,
} from './resolve-galias-path.service';

import { expect } from 'vitest';

describe('SERVICE: Resolve Galias path', () => {
  let resolveGaliasPathService: ResolveGaliasPathService;
  let inferPathsVariablesService: InferPathsVariablesService;
  let globMatchAdapter: PicomatchGlobMatchAdapter;
  let globFSAdapter: IsaacsGlobFSAdapter;

  beforeAll(() => {
    inferPathsVariablesService = new InferPathsVariablesService();
    globMatchAdapter = new PicomatchGlobMatchAdapter();
    globFSAdapter = new IsaacsGlobFSAdapter();

    resolveGaliasPathService = new ResolveGaliasPathService(
      globMatchAdapter,
      globFSAdapter,
      inferPathsVariablesService
    );
  });

  describe('resolve', () => {
    it('Should return an empty array if path is empty', async () => {
      const resolved = await resolveGaliasPathService.resolve(
        new GaliasPath('')
      );
      const expected: ResolvedGaliasPathMatch[] = [];

      expectArray(resolved).toEqual(expected);
    });
    it('Should resolve a basic path', async () => {
      const resolved = await resolveGaliasPathService.resolve(
        new GaliasPath(
          'samples/resolve-galias-path/cart/core/application/usecases/create/create.ts'
        )
      );
      const expected: ResolvedGaliasPathMatch[] = [
        {
          path: 'samples/resolve-galias-path/cart/core/application/usecases/create/create.ts',
        },
      ];
      expectArray(resolved).toEqual(expected);
    });
    it('Should throw an error for a glob path without variables', async () => {
      expect.assertions(1);
      try {
        await resolveGaliasPathService.resolve(
          new GaliasPath('samples/resolve-galias-path/**/*.adapter.{ts,js}')
        );
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidGaliasPathError);
      }
    });
    it('Should resolve a glob path with variables and respect exclude option', async () => {
      const resolved = await resolveGaliasPathService.resolve(
        new GaliasPath(
          'samples/resolve-galias-path/{{domain}}/**/usecases/{{usecase}}/*.ts'
        ),
        ['**/*.spec.*']
      );
      const expected: ResolvedGaliasPathMatch[] = [
        {
          path: 'samples/resolve-galias-path/cart/application/usecases/delete/delete.ts',
          variables: {
            domain: 'cart',
            usecase: 'delete',
          },
        },
        {
          path: 'samples/resolve-galias-path/cart/application/usecases/create/create.ts',
          variables: {
            domain: 'cart',
            usecase: 'create',
          },
        },
        {
          path: 'samples/resolve-galias-path/auth/core/application/usecases/delete/delete.ts',
          variables: {
            domain: 'auth',
            usecase: 'delete',
          },
        },
        {
          path: 'samples/resolve-galias-path/auth/core/application/usecases/create/create.ts',
          variables: {
            domain: 'auth',
            usecase: 'create',
          },
        },
      ];

      expectArray(resolved).toEqual(expected);
    });
    it('Should infer a variable if several paths match with same variables', async () => {
      const resolved = await resolveGaliasPathService.resolve(
        new GaliasPath(
          'samples/resolve-galias-path/{{domain}}/**/application/**/{{usecase}}/*.{ts,html}'
        ),
        ['**/*.spec.*']
      );
      const expected: ResolvedGaliasPathMatch[] = [
        {
          path: 'samples/resolve-galias-path/auth/core/application/usecases/create/create.ts',
          variables: {
            domain: 'auth',
            usecase: 'create',
            __pre_usecase: 'usecases',
          },
        },
        {
          path: 'samples/resolve-galias-path/auth/core/application/usecases/delete/delete.ts',
          variables: {
            domain: 'auth',
            usecase: 'delete',
          },
        },
        {
          path: 'samples/resolve-galias-path/auth/core/application/boundaries/create/create.output.ts',
          variables: {
            domain: 'auth',
            usecase: 'create',
            __pre_usecase: 'boundaries',
            __post_usecase: 'output',
          },
        },
        {
          path: 'samples/resolve-galias-path/auth/core/application/boundaries/create/sample.code.create.file.input.ts',
          variables: {
            domain: 'auth',
            usecase: 'create',
            __pre_usecase: 'boundaries',
            __post_usecase: 'sample',
          },
        },
        {
          path: 'samples/resolve-galias-path/auth/core/application/boundaries/create/sample1.code.create.file.input.ts',
          variables: {
            domain: 'auth',
            usecase: 'create',
            __pre_usecase: 'boundaries',
            __post_usecase: 'sample1/ts',
          },
        },
        {
          path: 'samples/resolve-galias-path/auth/core/application/boundaries/create/sample1.code.create.file.input.html',
          variables: {
            domain: 'auth',
            usecase: 'create',
            __pre_usecase: 'boundaries',
            __post_usecase: 'sample1/html',
          },
        },
        {
          path: 'samples/resolve-galias-path/auth/core/application/boundaries/create/sample2.code.create.file.input.ts',
          variables: {
            domain: 'auth',
            usecase: 'create',
            __pre_usecase: 'boundaries',
            __post_usecase: 'sample2',
          },
        },
        {
          path: 'samples/resolve-galias-path/cart/application/usecases/create/create.ts',
          variables: {
            domain: 'cart',
            usecase: 'create',
            __post_usecase: 'ts',
          },
        },
        {
          path: 'samples/resolve-galias-path/cart/application/usecases/create/create.html',
          variables: {
            domain: 'cart',
            usecase: 'create',
            __post_usecase: 'html',
          },
        },
        {
          path: 'samples/resolve-galias-path/cart/application/usecases/delete/delete.ts',
          variables: {
            domain: 'cart',
            usecase: 'delete',
          },
        },
      ];

      expectArray(resolved).toEqual(expected);
    });
  });
});

const expectArray = (actual: any[]) => ({
  toEqual: (expected: any[]) => {
    for (const entry of actual) {
      expect(expected).toContainEqual(entry);
    }
  },
});
