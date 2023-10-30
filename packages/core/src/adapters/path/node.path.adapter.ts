import { join, sep } from "path";
import { join as posixJoin } from "path/posix";
import { PathAdapter } from "../../galias/gateways/path.adapters";

export class NodePathAdapter implements PathAdapter {
  join(...paths: string[]): string {
    return join(...paths);
  }

  posixJoin(...paths: string[]): string {
    const posixPaths = paths.map((path) => this.toPosixPath(path));
    return posixJoin(...posixPaths);
  }

  toPosixPath(path: string): string {
    if (sep === "/") return path;
    return path.replace(/\\/g, "/");
  }

  get separator(): string {
    return sep;
  }
}
