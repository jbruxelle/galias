export interface ResolveConfigurationInput {
  prefix: string;
  exclude: string[];
  rootDir: string;
  sobriquets: Record<
    string,
    | string
    | {
        search: string;
        prefix?: string;
        exclude?: string[];
        rootDir?: string;
      }
  >;
  tsconfig?:
    | boolean
    | {
        source: string;
        output?: string;
      };
  jsconfig?:
    | boolean
    | {
        source: string;
        output?: string;
      };
}
