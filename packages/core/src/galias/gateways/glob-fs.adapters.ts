export interface GlobFSAdapter {
  find: (pattern: string, exclude?: string[]) => Promise<string[]>;
}
