import { expect } from 'vitest';
import { IsaacsGlobFSAdapter } from '../../../adapters/glob-fs/isaacs.glob-fs.adapters';
import { PicomatchGlobMatchAdapter } from '../../../adapters/glob-match/picomatch.glob-match.adapter';
import { InvalidSobriquetPathError } from '../../exceptions/invalid-sobriquet-path.exception';
import { SobriquetPath } from '../../value-objects/sobriquet-path';
import { InferPathsVariablesService } from '../infer-paths-variables/infer-paths-variables.service';
import {
  ResolveSobriquetPathService,
  ResolvedSobriquetPathMatch,
} from './resolve-sobriquet-path.service';

describe('SERVICE: Resolve Sobriquet path', () => {
  let resolveSobriquetPathService: ResolveSobriquetPathService;
  let inferPathsVariablesService: InferPathsVariablesService;
  let globMatchAdapter: PicomatchGlobMatchAdapter;
  let globFSAdapter: IsaacsGlobFSAdapter;

  beforeAll(() => {
    inferPathsVariablesService = new InferPathsVariablesService();
    globMatchAdapter = new PicomatchGlobMatchAdapter();
    globFSAdapter = new IsaacsGlobFSAdapter();

    resolveSobriquetPathService = new ResolveSobriquetPathService(
      globMatchAdapter,
      globFSAdapter,
      inferPathsVariablesService
    );
  });

  describe('resolve', () => {
    it('Should return an empty array if path is empty', async () => {
      const resolved = await resolveSobriquetPathService.resolve(
        new SobriquetPath('')
      );
      const expected: ResolvedSobriquetPathMatch[] = [];

      expectArray(resolved).toEqual(expected);
    });
    it('Should resolve a basic path', async () => {
      const resolved = await resolveSobriquetPathService.resolve(
        new SobriquetPath(
          '../../samples/resolve-sobriquet-path/cart/core/application/usecases/create/create.ts'
        )
      );
      const expected: ResolvedSobriquetPathMatch[] = [
        {
          path: '../../samples/resolve-sobriquet-path/cart/core/application/usecases/create/create.ts',
        },
      ];
      expectArray(resolved).toEqual(expected);
    });
    it('Should throw an error for a glob path without variables', async () => {
      expect.assertions(1);
      try {
        await resolveSobriquetPathService.resolve(
          new SobriquetPath(
            '../../samples/resolve-sobriquet-path/**/*.adapter.{ts,js}'
          )
        );
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidSobriquetPathError);
      }
    });
    it('Should resolve a glob path with variables and respect exclude option', async () => {
      const resolved = await resolveSobriquetPathService.resolve(
        new SobriquetPath(
          '../../samples/resolve-sobriquet-path/{{domain}}/**/usecases/{{usecase}}/*.ts'
        ),
        ['**/*.spec.*']
      );
      const expected: ResolvedSobriquetPathMatch[] = [
        {
          path: '../../samples/resolve-sobriquet-path/cart/application/usecases/delete/delete.ts',
          variables: {
            domain: 'cart',
            usecase: 'delete',
          },
        },
        {
          path: '../../samples/resolve-sobriquet-path/cart/application/usecases/create/create.ts',
          variables: {
            domain: 'cart',
            usecase: 'create',
          },
        },
        {
          path: '../../samples/resolve-sobriquet-path/auth/core/application/usecases/delete/delete.ts',
          variables: {
            domain: 'auth',
            usecase: 'delete',
          },
        },
        {
          path: '../../samples/resolve-sobriquet-path/auth/core/application/usecases/create/create.ts',
          variables: {
            domain: 'auth',
            usecase: 'create',
          },
        },
      ];

      expectArray(resolved).toEqual(expected);
    });
    it('Should infer a variable if several paths match with same variables', async () => {
      const resolved = await resolveSobriquetPathService.resolve(
        new SobriquetPath(
          '../../samples/resolve-sobriquet-path/{{domain}}/**/application/**/{{usecase}}/*.{ts,html}'
        ),
        ['**/*.spec.*']
      );
      const expected: ResolvedSobriquetPathMatch[] = [
        {
          path: '../../samples/resolve-sobriquet-path/auth/core/application/usecases/create/create.ts',
          variables: {
            domain: 'auth',
            usecase: 'create',
            __pre_usecase: 'usecases',
          },
        },
        {
          path: '../../samples/resolve-sobriquet-path/auth/core/application/usecases/delete/delete.ts',
          variables: {
            domain: 'auth',
            usecase: 'delete',
          },
        },
        {
          path: '../../samples/resolve-sobriquet-path/auth/core/application/boundaries/create/create.output.ts',
          variables: {
            domain: 'auth',
            usecase: 'create',
            __pre_usecase: 'boundaries',
            __post_usecase: 'output',
          },
        },
        {
          path: '../../samples/resolve-sobriquet-path/auth/core/application/boundaries/create/sample.code.create.file.input.ts',
          variables: {
            domain: 'auth',
            usecase: 'create',
            __pre_usecase: 'boundaries',
            __post_usecase: 'sample',
          },
        },
        {
          path: '../../samples/resolve-sobriquet-path/auth/core/application/boundaries/create/sample1.code.create.file.input.ts',
          variables: {
            domain: 'auth',
            usecase: 'create',
            __pre_usecase: 'boundaries',
            __post_usecase: 'sample1/ts',
          },
        },
        {
          path: '../../samples/resolve-sobriquet-path/auth/core/application/boundaries/create/sample1.code.create.file.input.html',
          variables: {
            domain: 'auth',
            usecase: 'create',
            __pre_usecase: 'boundaries',
            __post_usecase: 'sample1/html',
          },
        },
        {
          path: '../../samples/resolve-sobriquet-path/auth/core/application/boundaries/create/sample2.code.create.file.input.ts',
          variables: {
            domain: 'auth',
            usecase: 'create',
            __pre_usecase: 'boundaries',
            __post_usecase: 'sample2',
          },
        },
        {
          path: '../../samples/resolve-sobriquet-path/cart/application/usecases/create/create.ts',
          variables: {
            domain: 'cart',
            usecase: 'create',
            __post_usecase: 'ts',
          },
        },
        {
          path: '../../samples/resolve-sobriquet-path/cart/application/usecases/create/create.html',
          variables: {
            domain: 'cart',
            usecase: 'create',
            __post_usecase: 'html',
          },
        },
        {
          path: '../../samples/resolve-sobriquet-path/cart/application/usecases/delete/delete.ts',
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
    for (const item of expected) {
      expect(actual).toContainEqual(item);
    }
  },
});
