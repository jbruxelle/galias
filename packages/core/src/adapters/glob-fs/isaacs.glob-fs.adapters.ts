import { glob } from 'glob';
import { GlobFSAdapter } from '../../sobriquet/gateways/glob-fs.adapters';

export class IsaacsGlobFSAdapter implements GlobFSAdapter {
  async find(pattern: string, exlcude: string[] = []): Promise<string[]> {
    return await glob(pattern, { ignore: exlcude, posix: true });
  }
}
