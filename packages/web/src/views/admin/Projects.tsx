import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import type { Project, ProjectCategory } from '../../types';
import {
  Button,
  Card,
  CardContent,
  Input,
  Modal,
  Textarea,
  Badge,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../../components/ui';
import { formatDate } from '../../lib/utils';

export function ProjectsPage() {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    content: '',
    techStack: '',
    githubUrl: '',
    demoUrl: '',
    docsUrl: '',
    chromeUrl: '',
    firefoxUrl: '',
    npmUrl: '',
    featuredImage: '',
    status: 'DRAFT' as 'DRAFT' | 'PUBLISHED',
    isRecommended: false,
    isPinned: false,
    sortOrder: 0,
    categoryId: '',
  });

  const { data: projectsData, isLoading } = useQuery({
    queryKey: ['admin-projects'],
    queryFn: () => api.get<Project[]>('/projects'),
  });

  const { data: categories } = useQuery({
    queryKey: ['project-categories'],
    queryFn: () => api.get<ProjectCategory[]>('/project-categories'),
  });

  const createProject = useMutation({
    mutationFn: (data: Partial<Project>) => api.post<Project>('/projects', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      closeModal();
    },
    onError: (err: any) => setError(err.message),
  });

  const updateProject = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Project> }) =>
      api.put<Project>(`/projects/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      closeModal();
    },
    onError: (err: any) => setError(err.message),
  });

  const deleteProject = useMutation({
    mutationFn: (id: string) => api.delete(`/projects/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-projects'] }),
  });


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.name.trim() || !form.description.trim()) {
      setError('名称和描述不能为空');
      return;
    }
    
    // 处理技术栈格式
    let techStack = form.techStack;
    if (techStack && !techStack.startsWith('[')) {
      // 如果不是 JSON 格式，尝试用逗号分隔转换
      const tags = techStack.split(',').map(t => t.trim()).filter(Boolean);
      techStack = JSON.stringify(tags);
    }
    
    const data = { ...form, techStack, categoryId: form.categoryId || undefined };
    if (editingId) {
      await updateProject.mutateAsync({ id: editingId, data });
    } else {
      await createProject.mutateAsync(data);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setForm({
      name: project.name,
      slug: project.slug,
      description: project.description,
      content: project.content || '',
      techStack: project.techStack || '',
      githubUrl: project.githubUrl || '',
      demoUrl: project.demoUrl || '',
      docsUrl: project.docsUrl || '',
      chromeUrl: project.chromeUrl || '',
      firefoxUrl: project.firefoxUrl || '',
      npmUrl: project.npmUrl || '',
      featuredImage: project.featuredImage || '',
      status: project.status,
      isRecommended: project.isRecommended,
      isPinned: project.isPinned,
      sortOrder: project.sortOrder,
      categoryId: project.categoryId || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('确定要删除这个项目吗？')) {
      await deleteProject.mutateAsync(id);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm({
      name: '', slug: '', description: '', content: '', techStack: '', githubUrl: '', demoUrl: '',
      docsUrl: '', chromeUrl: '', firefoxUrl: '', npmUrl: '', featuredImage: '', status: 'DRAFT', isRecommended: false,
      isPinned: false, sortOrder: 0, categoryId: '',
    });
    setError(null);
  };

  const projects = projectsData || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">项目管理</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsCategoryModalOpen(true)}>
            分类管理
          </Button>
          <Button onClick={() => setIsModalOpen(true)}>新建项目</Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">加载中...</div>
          ) : !projects.length ? (
            <div className="p-8 text-center text-gray-500">暂无项目</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>名称</TableHead>
                  <TableHead>分类</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>标记</TableHead>
                  <TableHead>排序</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.name}</TableCell>
                    <TableCell>{project.category?.name || '-'}</TableCell>
                    <TableCell>
                      <Badge variant={project.status === 'PUBLISHED' ? 'success' : 'default'}>
                        {project.status === 'PUBLISHED' ? '已发布' : '草稿'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {project.isPinned && <Badge variant="warning">置顶</Badge>}
                        {project.isRecommended && <Badge variant="primary">推荐</Badge>}
                      </div>
                    </TableCell>
                    <TableCell>{project.sortOrder}</TableCell>
                    <TableCell>{formatDate(project.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(project)}>
                          编辑
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(project.id)} className="text-red-600">
                          删除
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>


      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingId ? '编辑项目' : '新建项目'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
              {error}
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <Input label="名称" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input label="链接" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="留空自动生成" />
          </div>
          <Textarea label="简介" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          <Input 
            label="技术栈" 
            value={form.techStack} 
            onChange={(e) => setForm({ ...form, techStack: e.target.value })} 
            placeholder='["React", "TypeScript", "Node.js"] 或用逗号分隔: React, TypeScript, Node.js'
          />
          <Textarea label="详细说明 (Markdown)" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="min-h-[120px]" />
          <div className="grid grid-cols-3 gap-4">
            <Input label="GitHub" value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} placeholder="https://github.com/..." />
            <Input label="演示地址" value={form.demoUrl} onChange={(e) => setForm({ ...form, demoUrl: e.target.value })} placeholder="https://..." />
            <Input label="文档地址" value={form.docsUrl} onChange={(e) => setForm({ ...form, docsUrl: e.target.value })} placeholder="https://..." />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input label="Chrome商店" value={form.chromeUrl} onChange={(e) => setForm({ ...form, chromeUrl: e.target.value })} placeholder="https://chrome.google.com/..." />
            <Input label="Firefox商店" value={form.firefoxUrl} onChange={(e) => setForm({ ...form, firefoxUrl: e.target.value })} placeholder="https://addons.mozilla.org/..." />
            <Input label="NPM包" value={form.npmUrl} onChange={(e) => setForm({ ...form, npmUrl: e.target.value })} placeholder="https://www.npmjs.com/..." />
          </div>
          <Input label="特色图片" value={form.featuredImage} onChange={(e) => setForm({ ...form, featuredImage: e.target.value })} placeholder="图片URL" />
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">分类</label>
              <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700">
                <option value="">无分类</option>
                {categories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">状态</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as 'DRAFT' | 'PUBLISHED' })} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700">
                <option value="DRAFT">草稿</option>
                <option value="PUBLISHED">已发布</option>
              </select>
            </div>
            <Input label="排序" type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })} />
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.isPinned} onChange={(e) => setForm({ ...form, isPinned: e.target.checked })} className="rounded" />
              <span>置顶</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.isRecommended} onChange={(e) => setForm({ ...form, isRecommended: e.target.checked })} className="rounded" />
              <span>推荐</span>
            </label>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={closeModal}>取消</Button>
            <Button type="submit" loading={createProject.isPending || updateProject.isPending}>保存</Button>
          </div>
        </form>
      </Modal>

      <ProjectCategoryModal isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)} />
    </div>
  );
}


function ProjectCategoryModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: categories } = useQuery({
    queryKey: ['project-categories'],
    queryFn: () => api.get<ProjectCategory[]>('/project-categories'),
  });

  const createCategory = useMutation({
    mutationFn: (data: { name: string }) => api.post('/project-categories', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-categories'] });
      setName('');
    },
  });

  const updateCategory = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => api.put(`/project-categories/${id}`, { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-categories'] });
      setName('');
      setEditingId(null);
    },
  });

  const deleteCategory = useMutation({
    mutationFn: (id: string) => api.delete(`/project-categories/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['project-categories'] }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (editingId) {
      updateCategory.mutate({ id: editingId, name });
    } else {
      createCategory.mutate({ name });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="项目分类管理">
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="分类名称" className="flex-1" />
        <Button type="submit">{editingId ? '更新' : '添加'}</Button>
        {editingId && (
          <Button type="button" variant="outline" onClick={() => { setEditingId(null); setName(''); }}>取消</Button>
        )}
      </form>
      <div className="space-y-2">
        {categories?.map((cat) => (
          <div key={cat.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
            <span>{cat.name}</span>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => { setEditingId(cat.id); setName(cat.name); }}>编辑</Button>
              <Button variant="ghost" size="sm" className="text-red-600" onClick={() => deleteCategory.mutate(cat.id)}>删除</Button>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}
