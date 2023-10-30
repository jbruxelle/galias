import { InferPathsVariablesService } from './infer-paths-variables.service';

describe('SERVICE: Find paths differences', () => {
  let service: InferPathsVariablesService;

  beforeEach(() => {
    service = new InferPathsVariablesService();
  });

  describe('findDifferences', () => {
    it('should return the differences between paths', () => {
      const paths = ['path/to/file.ext', 'path/to/other.file.ext'];
      const variables = { variable: 'to' };
      const differences = service.infer(paths, variables);
      expect(differences).toEqual([
        {
          path: 'path/to/file.ext',
          variables: {},
        },
        {
          path: 'path/to/other.file.ext',
          variables: {
            __post_variable: 'other',
          },
        },
      ]);
    });

    it('should handle multiple variables', () => {
      const paths = ['path/to/file.ext', 'some/path/to/other.file.ext'];
      const variables = { variable1: 'to', variable2: 'file' };
      const differences = service.infer(paths, variables);
      expect(differences).toEqual([
        {
          path: 'path/to/file.ext',
          variables: {},
        },
        {
          path: 'some/path/to/other.file.ext',
          variables: {
            __pre_variable1: 'some',
            __pre_variable2: 'other',
          },
        },
      ]);
    });
  });
});
