import { getPublishedProjects, getProjectCategories, getPublicSettings } from '@/lib/api-server';
import { ProjectsClient } from './projects-client';
import { notFound } from 'next/navigation';

export const metadata = {
  title: '项目展示',
  description: '我的开源项目和作品展示',
};

export default async function ProjectsPage() {
  const [projects, categories, settings] = await Promise.all([
    getPublishedProjects(),
    getProjectCategories(),
    getPublicSettings(),
  ]);

  // 检查页面是否启用
  if (settings?.projectsPageEnabled === 'false') {
    notFound();
  }

  return (
    <ProjectsClient
      projects={projects || []}
      categories={categories || []}
      template={settings?.projectsPageTemplate || 'standard'}
    />
  );
}
