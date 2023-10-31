export interface PathAdapter {
  join(...paths: string[]): string;
  posixJoin(...paths: string[]): string;
  relative(from: string, to: string): string;
  relativePosix(from: string, to: string): string;
  toPosixPath(path: string): string;
  separator: string;
}
