import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import type { FriendLink } from '../../types';
import {
  Button,
  Card,
  CardContent,
  Input,
  Modal,
  Textarea,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../../components/ui';
import { formatDate } from '../../lib/utils';

export function FriendLinksPage() {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    url: '',
    description: '',
    logo: '',
    sortOrder: 0,
  });

  const { data: links, isLoading } = useQuery({
    queryKey: ['friend-links'],
    queryFn: () => api.get<FriendLink[]>('/friend-links'),
  });

  const createLink = useMutation({
    mutationFn: (data: Partial<FriendLink>) => api.post<FriendLink>('/friend-links', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friend-links'] });
      closeModal();
    },
    onError: (err: any) => setError(err.message),
  });

  const updateLink = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<FriendLink> }) =>
      api.put<FriendLink>(`/friend-links/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friend-links'] });
      closeModal();
    },
    onError: (err: any) => setError(err.message),
  });

  const deleteLink = useMutation({
    mutationFn: (id: string) => api.delete(`/friend-links/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['friend-links'] }),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.name.trim() || !form.url.trim()) {
      setError('名称和链接不能为空');
      return;
    }
    if (editingId) {
      await updateLink.mutateAsync({ id: editingId, data: form });
    } else {
      await createLink.mutateAsync(form);
    }
  };

  const handleEdit = (link: FriendLink) => {
    setEditingId(link.id);
    setForm({
      name: link.name,
      url: link.url,
      description: link.description || '',
      logo: link.logo || '',
      sortOrder: link.sortOrder,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('确定要删除这个友链吗？')) {
      await deleteLink.mutateAsync(id);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm({ name: '', url: '', description: '', logo: '', sortOrder: 0 });
    setError(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">友链管理</h1>
        <Button onClick={() => setIsModalOpen(true)}>添加友链</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">加载中...</div>
          ) : !links?.length ? (
            <div className="p-8 text-center text-gray-500">暂无友链</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Logo</TableHead>
                  <TableHead>名称</TableHead>
                  <TableHead>链接</TableHead>
                  <TableHead>描述</TableHead>
                  <TableHead>排序</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {links.map((link) => (
                  <TableRow key={link.id}>
                    <TableCell>
                      {link.logo ? (
                        <img src={link.logo} alt={link.name} className="w-8 h-8 rounded object-cover" />
                      ) : (
                        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center text-xs">
                          {link.name[0]}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{link.name}</TableCell>
                    <TableCell>
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {link.url}
                      </a>
                    </TableCell>
                    <TableCell className="text-gray-500 max-w-[200px] truncate">{link.description || '-'}</TableCell>
                    <TableCell>{link.sortOrder}</TableCell>
                    <TableCell>{formatDate(link.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(link)}>编辑</Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(link.id)} className="text-red-600">删除</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingId ? '编辑友链' : '添加友链'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
              {error}
            </div>
          )}
          <Input label="名称" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="链接" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://..." required />
          <Textarea label="描述" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <Input label="Logo" value={form.logo} onChange={(e) => setForm({ ...form, logo: e.target.value })} placeholder="图片URL" />
          <Input label="排序" type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })} />
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={closeModal}>取消</Button>
            <Button type="submit" loading={createLink.isPending || updateLink.isPending}>保存</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
