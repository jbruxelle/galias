import { sep, join, normalize } from "path";
import { join as posixJoin } from "path/posix";
import { PathAdapter } from "../../../../core/gateway/path.adapters";

export class TestsPathAdapter implements PathAdapter {
  join(...paths: string[]): string {
    return normalize(join(...paths));
  }

  posixJoin(...paths: string[]): string {
    return posixJoin(...paths);
  }

  toPosixPath(path: string): string {
    if (sep === "/") return path;
    return path.replace(/\\/g, "/");
  }

  get separator(): string {
    return sep;
  }
}
