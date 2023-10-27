export interface PathAdapter {
  join(...paths: string[]): string;
  posixJoin(...paths: string[]): string;
  toPosixPath(path: string): string;
  separator: string;
}
