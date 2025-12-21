import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import type { Page } from '../../types';
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

const BUILTIN_PAGES = [
  { key: 'about', name: '关于页面', path: '/about' },
  { key: 'projects', name: '项目页面', path: '/projects' },
  { key: 'friends', name: '友链页面', path: '/friends' },
];

const TEMPLATES = [
  { value: 'standard', label: '标准布局' },
  { value: 'fullwidth', label: '全宽布局' },
  { value: 'sidebar', label: '侧边栏布局' },
];

export function PagesPage() {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'builtin' | 'custom'>('builtin');
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [aboutContent, setAboutContent] = useState('');
  
  const { data: pages, isLoading } = useQuery({
    queryKey: ['pages'],
    queryFn: () => api.get<Page[]>('/pages'),
  });

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => api.get<Record<string, string>>('/settings'),
  });

  const updateSetting = useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) =>
      api.put('/settings', { key, value }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['settings'] }),
  });

  const togglePageEnabled = (pageKey: string) => {
    const key = `${pageKey}PageEnabled`;
    const current = settings?.[key] !== 'false';
    updateSetting.mutate({ key, value: current ? 'false' : 'true' });
  };

  const updateTemplate = (pageKey: string, template: string) => {
    updateSetting.mutate({ key: `${pageKey}PageTemplate`, value: template });
  };

  const openAboutEditor = () => {
    setAboutContent(settings?.aboutPageContent || '');
    setAboutModalOpen(true);
  };

  const saveAboutContent = () => {
    updateSetting.mutate({ key: 'aboutPageContent', value: aboutContent });
    setAboutModalOpen(false);
  };

  const createPage = useMutation({
    mutationFn: (data: Partial<Page>) => api.post<Page>('/pages', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
      setError(null);
    },
    onError: (err: any) => {
      setError(err.message || '创建失败');
    },
  });

  const updatePage = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Page> }) =>
      api.put<Page>(`/pages/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
      setError(null);
    },
    onError: (err: any) => {
      setError(err.message || '更新失败');
    },
  });

  const deletePage = useMutation({
    mutationFn: (id: string) => api.delete(`/pages/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pages'] }),
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '',
    slug: '',
    content: '',
    showInNav: false,
    sortOrder: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!form.title.trim()) {
      setError('标题不能为空');
      return;
    }
    
    try {
      if (editingId) {
        await updatePage.mutateAsync({ id: editingId, data: form });
      } else {
        await createPage.mutateAsync(form);
      }
      closeModal();
    } catch (err) {
      // 错误已在 mutation 的 onError 中处理
      console.error('保存失败:', err);
    }
  };

  const handleEdit = (page: Page) => {
    setEditingId(page.id);
    setForm({
      title: page.title,
      slug: page.slug,
      content: page.content,
      showInNav: page.showInNav,
      sortOrder: page.sortOrder,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('确定要删除这个页面吗？')) {
      await deletePage.mutateAsync(id);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm({ title: '', slug: '', content: '', showInNav: false, sortOrder: 0 });
    setError(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">页面管理</h1>
        <Button onClick={() => setIsModalOpen(true)}>新建页面</Button>
      </div>

      {/* Tab 切换 */}
      <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('builtin')}
          className={`pb-2 px-1 border-b-2 transition-colors ${
            activeTab === 'builtin'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          内置页面
        </button>
        <button
          onClick={() => setActiveTab('custom')}
          className={`pb-2 px-1 border-b-2 transition-colors ${
            activeTab === 'custom'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          自定义页面
        </button>
      </div>

      {activeTab === 'builtin' ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>页面</TableHead>
                  <TableHead>路径</TableHead>
                  <TableHead>模板</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {BUILTIN_PAGES.map((page) => {
                  const enabled = settings?.[`${page.key}PageEnabled`] !== 'false';
                  const template = settings?.[`${page.key}PageTemplate`] || 'standard';
                  return (
                    <TableRow key={page.key}>
                      <TableCell className="font-medium">{page.name}</TableCell>
                      <TableCell className="text-gray-500">{page.path}</TableCell>
                      <TableCell>
                        <select
                          value={template}
                          onChange={(e) => updateTemplate(page.key, e.target.value)}
                          className="px-2 py-1 text-sm border rounded dark:bg-gray-800 dark:border-gray-700"
                        >
                          {TEMPLATES.map((t) => (
                            <option key={t.value} value={t.value}>{t.label}</option>
                          ))}
                        </select>
                      </TableCell>
                      <TableCell>
                        <Badge variant={enabled ? 'success' : 'default'}>
                          {enabled ? '已启用' : '已禁用'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => togglePageEnabled(page.key)}
                          >
                            {enabled ? '禁用' : '启用'}
                          </Button>
                          {page.key === 'about' && (
                            <Button variant="ghost" size="sm" onClick={openAboutEditor}>
                              编辑内容
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 text-center text-gray-500">加载中...</div>
            ) : !pages?.length ? (
              <div className="p-8 text-center text-gray-500">暂无页面</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>标题</TableHead>
                    <TableHead>链接</TableHead>
                    <TableHead>导航</TableHead>
                    <TableHead>排序</TableHead>
                    <TableHead>创建时间</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pages.map((page) => (
                    <TableRow key={page.id}>
                      <TableCell className="font-medium">{page.title}</TableCell>
                      <TableCell className="text-gray-500">/{page.slug}</TableCell>
                      <TableCell>
                        {page.showInNav && <Badge variant="primary">显示</Badge>}
                      </TableCell>
                      <TableCell>{page.sortOrder}</TableCell>
                      <TableCell>{formatDate(page.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(page)}>
                            编辑
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(page.id)}
                            className="text-red-600"
                          >
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
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingId ? '编辑页面' : '新建页面'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
              {error}
            </div>
          )}
          <Input
            label="标题"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <Input
            label="链接"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            placeholder="留空自动生成"
          />
          <Textarea
            label="内容 (Markdown)"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            className="min-h-[200px]"
          />
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 whitespace-nowrap">
              <input
                type="checkbox"
                checked={form.showInNav}
                onChange={(e) => setForm({ ...form, showInNav: e.target.checked })}
                className="rounded"
              />
              <span>显示在导航</span>
            </label>
            <div className="w-24">
              <Input
                label="排序"
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={closeModal}>
              取消
            </Button>
            <Button type="submit" loading={createPage.isPending || updatePage.isPending}>
              保存
            </Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={aboutModalOpen} onClose={() => setAboutModalOpen(false)} title="编辑关于页面" size="lg">
        <div className="space-y-4">
          <Textarea
            label="内容 (Markdown)"
            value={aboutContent}
            onChange={(e) => setAboutContent(e.target.value)}
            className="min-h-[300px]"
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setAboutModalOpen(false)}>取消</Button>
            <Button onClick={saveAboutContent}>保存</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
