export interface ComputeSobriquetsInput {
  sobriquets: Record<
    string,
    {
      search: string;
      prefix: string;
      exclude: string[];
      rootDir: string;
    }
  >;
}
