import picomatch from "picomatch";
import { GlobMatchAdapter } from "../../galias/gateways/glob-match.adapter";

const { makeRe, scan, isMatch } = picomatch;

export class PicomatchGlobMatchAdapter implements GlobMatchAdapter {
  isGlob(glob: string): boolean {
    const { isGlob } = scan(glob);
    return isGlob;
  }
  toRegexp(glob: string): RegExp {
    return makeRe(glob);
  }
  isMatch(path: string, glob: string | string[]): boolean {
    return isMatch(path, glob);
  }
}
