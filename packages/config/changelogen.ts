import { ChangelogConfig } from 'changelogen';

interface ChangelogPackageInfo {
  name: string;
}

export const createChangelogenConfig = (
  info: ChangelogPackageInfo
): Partial<ChangelogConfig> => ({
  templates: {
    commitMessage: `:package: - RELEASE: ${info.name} v{{newVersion}}`,
    tagMessage: `${info.name}@v{{newVersion}}`,
    tagBody: `${info.name}@v{{newVersion}}`,
  },
});
