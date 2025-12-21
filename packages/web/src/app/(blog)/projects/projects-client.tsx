'use client';

import { useState, useMemo } from 'react';
import type { Project, ProjectCategory } from '@/types';
import {
  Github,
  ExternalLink,
  FileText,
  Search,
  Code2,
  Layers,
  Star,
  Pin,
} from 'lucide-react';

interface Props {
  projects: Project[];
  categories: ProjectCategory[];
  template: string;
}

export function ProjectsClient({ projects, categories, template }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // 解析技术栈
  const parseTechStack = (techStack?: string): string[] => {
    if (!techStack) return [];
    try {
      const parsed = JSON.parse(techStack);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  // 过滤项目
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesCategory =
        !selectedCategory || project.categoryId === selectedCategory;
      const techStack = parseTechStack(project.techStack);
      const matchesSearch =
        !searchQuery ||
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        techStack.some((t) =>
          t.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchesCategory && matchesSearch;
    });
  }, [projects, selectedCategory, searchQuery]);

  // 分离置顶和推荐项目
  const pinnedProjects = filteredProjects.filter((p) => p.isPinned);
  const featuredProjects = filteredProjects.filter(
    (p) => p.isRecommended && !p.isPinned
  );
  const regularProjects = filteredProjects.filter(
    (p) => !p.isPinned && !p.isRecommended
  );

  const containerClass =
    template === 'fullwidth'
      ? 'max-w-full px-4'
      : template === 'sidebar'
        ? 'max-w-6xl mx-auto px-4'
        : 'max-w-7xl mx-auto px-4';

  return (
    <div
      className={`min-h-screen bg-slate-50 dark:bg-slate-950 py-12 ${containerClass} transition-colors duration-300`}
    >
      {/* 头部区域 */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white sm:text-5xl tracking-tight mb-4">
          我的开源项目
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          这里展示了我参与或主导的开源项目，涵盖前端开发、后端工程以及各种效率工具。持续探索，不断输出。
        </p>
      </div>

      {/* 工具栏: 搜索与分类 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
          <input
            type="text"
            placeholder="搜索项目、技术栈..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              !selectedCategory
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-blue-500'
            }`}
          >
            全部
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-blue-500'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* 项目列表 */}
      {filteredProjects.length > 0 ? (
        <div className="space-y-8">
          {/* 置顶项目 */}
          {pinnedProjects.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Pin size={14} />
                置顶项目
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pinnedProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    parseTechStack={parseTechStack}
                  />
                ))}
              </div>
            </div>
          )}

          {/* 推荐项目 */}
          {featuredProjects.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Star size={14} />
                推荐项目
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    parseTechStack={parseTechStack}
                  />
                ))}
              </div>
            </div>
          )}

          {/* 其他项目 */}
          {regularProjects.length > 0 && (
            <div>
              {(pinnedProjects.length > 0 || featuredProjects.length > 0) && (
                <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                  所有项目
                </h2>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    parseTechStack={parseTechStack}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="inline-flex p-4 rounded-full bg-slate-100 dark:bg-slate-900 mb-4">
            <Search size={32} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-white">
            未找到匹配的项目
          </h3>
          <p className="text-slate-500 dark:text-slate-400">
            尝试调整搜索词或过滤器
          </p>
        </div>
      )}

      {/* 底部 CTA */}
      <div className="mt-20 p-8 rounded-3xl bg-blue-600 text-white text-center relative overflow-hidden shadow-2xl shadow-blue-500/20">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2">想要交流或贡献？</h2>
          <p className="mb-6 opacity-90">
            我的所有开源项目都欢迎 Issue 和 PR，让我们一起构建更好的软件。
          </p>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-xl font-bold hover:bg-slate-50 transition-colors"
          >
            访问 GitHub
            <ExternalLink size={18} />
          </a>
        </div>
        {/* 背景装饰 */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-50" />
      </div>
    </div>
  );
}

function ProjectCard({
  project,
  parseTechStack,
}: {
  project: Project;
  parseTechStack: (techStack?: string) => string[];
}) {
  const techStack = parseTechStack(project.techStack);

  return (
    <div className="group relative flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      {/* 装饰边框 */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* 特色图片 */}
      {project.featuredImage && (
        <div className="relative h-40 overflow-hidden">
          <img
            src={project.featuredImage}
            alt={project.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      )}

      <div className="p-6 flex-1 flex flex-col">
        {/* 项目标题与标签 */}
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
            <Code2 size={24} />
          </div>
          <div className="flex gap-1">
            {project.isPinned && (
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded">
                置顶
              </span>
            )}
            {project.isRecommended && (
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded">
                推荐
              </span>
            )}
          </div>
        </div>

        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {project.name}
        </h3>

        <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 line-clamp-2">
          {project.description}
        </p>

        {/* 技术栈标签 */}
        {techStack.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {techStack.slice(0, 5).map((tech) => (
              <span
                key={tech}
                className="text-[11px] px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md"
              >
                {tech}
              </span>
            ))}
            {techStack.length > 5 && (
              <span className="text-[11px] px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-md">
                +{techStack.length - 5}
              </span>
            )}
          </div>
        )}

        {/* 分类信息 */}
        <div className="flex items-center gap-4 mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
          {project.category && (
            <div className="flex items-center text-slate-500 dark:text-slate-400 text-xs">
              <Layers size={14} className="mr-1" />
              {project.category.name}
            </div>
          )}
        </div>
      </div>

      {/* 底部操作按钮 */}
      <div className="flex border-t border-slate-100 dark:border-slate-800">
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <Github size={16} />
            Code
          </a>
        )}
        {project.demoUrl && (
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors border-l border-slate-100 dark:border-slate-800"
          >
            <ExternalLink size={16} />
            Demo
          </a>
        )}
        {project.docsUrl && (
          <a
            href={project.docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-l border-slate-100 dark:border-slate-800"
          >
            <FileText size={16} />
            Docs
          </a>
        )}
        {!project.githubUrl && !project.demoUrl && !project.docsUrl && (
          <div className="flex-1 flex items-center justify-center py-3 text-sm text-slate-400">
            暂无链接
          </div>
        )}
      </div>
    </div>
  );
}
