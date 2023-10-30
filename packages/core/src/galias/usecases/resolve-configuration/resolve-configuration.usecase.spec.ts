 import { FakeConfigurationAdapter } from '../../../adapters/configuration/fake.configuration.adapter';
import { ResolveConfigurationInput } from '../../boundaries/resolve-configuration/resolve-configuration.input';
import { defaultPluginOptions } from '../../plugin/plugin.options.defaults';
import { ResolveConfigurationUsecase } from './resolve-configuration.usecase';

describe('USECASE: Resolve configuration', () => {
  let usecase: ResolveConfigurationUsecase;
  let fakeConfigurationAdapter: FakeConfigurationAdapter;
  let defaultOptions: ResolveConfigurationInput;

   

  beforeEach(() => {
    usecase = new ResolveConfigurationUsecase();
    fakeConfigurationAdapter = new FakeConfigurationAdapter();
  });

  it('Should not change the configuration if no galiases are provided', async () => {
    const input = { adapters: [fakeConfigurationAdapter], galiases: {} };
    const output = await usecase.execute({ ...defaultPluginOptions, ...input });

    const expected = {
      adapters: [fakeConfigurationAdapter],
      galiases: {},
    };

    expect(output).toEqual(expected);
  });

  it('Should not change the configuration if object galiases are provided', async () => {
    const input = {
      adapters: [fakeConfigurationAdapter],
      galiases: {
        galias: {
          search: 'some/path',
          prefix: '@',
          exclude: ['src'],
          rootDir: 'src',
        },
      },
    };

    const output = await usecase.execute({ ...defaultOptions, ...input });

    expect(output).toEqual({
      adapters: [fakeConfigurationAdapter],
      galiases: {
        galias: {
          search: 'some/path',
          prefix: '@',
          exclude: ['src'],
          rootDir: 'src',
        },
      },
    });
  });

  it('Should change the string galiases to object galiases', async () => {
    const input = {
      prefix: '@',
      exclude: ['src'],
      rootDir: 'src',
      adapters: [fakeConfigurationAdapter],
      galiases: {
        galias: 'some/path',
      },
    };

    const output = await usecase.execute({ ...defaultOptions, ...input });

    expect(output).toEqual({
      adapters: [fakeConfigurationAdapter],
      galiases: {
        galias: {
          search: 'some/path',
          prefix: '@',
          exclude: ['src'],
          rootDir: 'src',
        },
      },
    });
  });
});
