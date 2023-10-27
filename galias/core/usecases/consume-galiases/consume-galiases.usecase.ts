import { Usecase } from "../../../shared/usecase";
import { ConsumeGaliasesInput } from "../../boundaries/consume-galiases/consume-galiases.input";

export class ConsumeGaliasesUsecase
  implements Usecase<ConsumeGaliasesInput, void>
{
  async execute(input: ConsumeGaliasesInput): Promise<void> {
    const { paths, configurationAdapters } = input;
    for (const configurationAdapter of configurationAdapters) {
      await configurationAdapter.consume(paths);
    }
  }
}
