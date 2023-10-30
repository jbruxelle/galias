import { FakeConfigurationAdapter } from '../../../adapters/configuration/fake.configuration.adapter';
import { ConsumeGaliasesUsecase } from './consume-galiases.usecase';

describe('USECASE: Consume galiases', () => {
  let configurationAdapter: FakeConfigurationAdapter;
  let usecase: ConsumeGaliasesUsecase;

  beforeEach(() => {
    configurationAdapter = new FakeConfigurationAdapter({
      source: './samples/resolve-configuration/configuration/fakeconfig.json',
      output: './samples/consume-galiases/fakeconfig.json',
    });

    usecase = new ConsumeGaliasesUsecase();
  });

  it('Should not override existing configuration aliases', async () => {
    await usecase.execute({
      languageConfigurationAdapters: [configurationAdapter],
      paths: { $auth: 'something' },
    });

    const configuration = await configurationAdapter.resolve('ouput');

    expect(configuration['paths']).toEqual({
      '@': 'src',
      $auth: 'something',
    });
  });
});
