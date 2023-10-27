export interface GlobMatchAdapter {
  toRegexp: (glob: string) => RegExp;
  isGlob: (glob: string) => boolean;
  isMatch(path: string, glob: string | string[]): boolean;
}
