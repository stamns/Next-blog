'use client';

import { useState } from 'react';
import type { Project, ProjectCategory } from '@/types';
import { Github, ExternalLink, FileText } from 'lucide-react';

interface Props {
  projects: Project[];
  categories: ProjectCategory[];
  template: string;
}

export function ProjectsClient({ projects, categories, template }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredProjects = selectedCategory
    ? projects.filter((p) => p.categoryId === selectedCategory)
    : projects;

  const containerClass =
    template === 'fullwidth'
      ? 'max-w-full px-4'
      : template === 'sidebar'
        ? 'max-w-6xl mx-auto px-4'
        : 'max-w-4xl mx-auto px-4';

  return (
    <div className={`${containerClass} py-8`}>
      <h1 className="text-3xl font-bold mb-6">项目展示</h1>

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-sm transition-colors ${
              !selectedCategory
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            全部
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {filteredProjects.length === 0 ? (
        <div className="text-center py-12 text-gray-500">暂无项目</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
      {project.featuredImage && (
        <img
          src={project.featuredImage}
          alt={project.name}
          className="w-full h-40 object-cover"
        />
      )}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-lg font-semibold">{project.name}</h3>
          <div className="flex gap-1 flex-shrink-0">
            {project.isPinned && (
              <span className="px-2 py-0.5 text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded">
                置顶
              </span>
            )}
            {project.isRecommended && (
              <span className="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded">
                推荐
              </span>
            )}
          </div>
        </div>
        {project.category && (
          <span className="inline-block px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 rounded mb-2">
            {project.category.name}
          </span>
        )}
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
          {project.description}
        </p>
        <div className="flex gap-3">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
          )}
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
            >
              <ExternalLink className="w-4 h-4" />
              演示
            </a>
          )}
          {project.docsUrl && (
            <a
              href={project.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
            >
              <FileText className="w-4 h-4" />
              文档
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
