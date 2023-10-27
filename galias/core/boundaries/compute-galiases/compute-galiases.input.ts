export interface ComputeGaliasesInput {
  galiases: Record<
    string,
    {
      search: string;
      prefix: string;
      exclude: string[];
      rootDir: string;
    }
  >;
}
