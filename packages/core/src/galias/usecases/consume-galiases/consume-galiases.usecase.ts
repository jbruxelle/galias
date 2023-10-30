import { Usecase } from "../../../types/usecase";
import { ConsumeGaliasesInput } from "../../boundaries/consume-galiases/consume-galiases.input";

export class ConsumeGaliasesUsecase
  implements Usecase<ConsumeGaliasesInput, void>
{
  async execute(input: ConsumeGaliasesInput): Promise<void> {
    const { paths, languageConfigurationAdapters } = input;
    for (const adapter of languageConfigurationAdapters) {
      await adapter.consume(paths);
    }
  }
}
