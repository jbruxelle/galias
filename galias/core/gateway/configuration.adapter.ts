export interface ConfigurationAdapterOptions {
  source?: string;
  output?: string;
}

export interface ConfigurationAdapter {
  name: string;
  configFileName: string;
  defaultSource: string;
  source: string;
  output: string;
  resolve(): Promise<Record<string, any>>;
  consume(paths: Record<string, string>): Promise<void>;
}
