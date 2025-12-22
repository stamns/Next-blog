'use client';

import { useThemeContext } from '@/contexts/theme-context';
import { getTheme } from '@/themes';
import { DefaultProjectDetail } from '@/themes/shared';
import type { ProjectDetailProps } from '@/themes';

interface Props {
  project: ProjectDetailProps['project'];
}

export function ProjectDetailClient({ project }: Props) {
  const { themeName, themeConfig } = useThemeContext();
  const theme = getTheme(themeName);

  // 使用主题自定义的 ProjectDetail 组件，如果没有则使用默认组件
  const ProjectDetailComponent = theme.ProjectDetail || DefaultProjectDetail;

  // 不需要再包裹 BlogLayout，因为 (blog)/layout.tsx 已经包裹过了
  return <ProjectDetailComponent project={project} config={themeConfig} />;
}
