import { Usecase } from '../../../types/usecase';
import { ConsumeSobriquetsInput } from '../../boundaries/consume-sobriquets/consume-sobriquets.input';

export class ConsumeSobriquetsUsecase
  implements Usecase<ConsumeSobriquetsInput, void>
{
  async execute(input: ConsumeSobriquetsInput): Promise<void> {
    const { paths, languageConfigurationAdapters } = input;
    for (const adapter of languageConfigurationAdapters) {
      await adapter.consume(paths);
    }
  }
}
