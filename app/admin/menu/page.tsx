'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Trash2, Edit, Menu as MenuIcon, MoveUp, MoveDown } from 'lucide-react';
import { toast } from 'sonner';

interface MenuLink {
  id: string;
  title: string;
  href: string;
  parent_id?: string;
  position: number;
  is_active: boolean;
  icon?: string;
}

export default function MenuPage() {
  const [menuLinks, setMenuLinks] = useState<MenuLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuLink | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    href: '',
    icon: '',
    is_active: true,
  });

  useEffect(() => {
    fetchMenuLinks();
  }, []);

  async function fetchMenuLinks() {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('menu_links')
        .select('*')
        .is('parent_id', null)
        .order('position');

      if (error) throw error;
      setMenuLinks(data || []);
    } catch (error) {
      console.error('Error fetching menu links:', error);
      toast.error('Gagal memuat menu');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit() {
    try {
      const supabase = createClient();

      if (editingItem) {
        const { error } = await supabase
          .from('menu_links')
          .update(formData)
          .eq('id', editingItem.id);

        if (error) throw error;
        toast.success('Menu berhasil diupdate');
      } else {
        const maxPosition = menuLinks.length > 0
          ? Math.max(...menuLinks.map(m => m.position))
          : -1;

        const { error } = await supabase
          .from('menu_links')
          .insert([{ ...formData, position: maxPosition + 1 }]);

        if (error) throw error;
        toast.success('Menu berhasil ditambahkan');
      }

      setDialogOpen(false);
      resetForm();
      fetchMenuLinks();
    } catch (error) {
      console.error('Error saving menu:', error);
      toast.error('Gagal menyimpan menu');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Yakin ingin menghapus menu ini?')) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('menu_links')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Menu berhasil dihapus');
      fetchMenuLinks();
    } catch (error) {
      console.error('Error deleting menu:', error);
      toast.error('Gagal menghapus menu');
    }
  }

  async function moveMenu(id: string, direction: 'up' | 'down') {
    const index = menuLinks.findIndex(m => m.id === id);
    if (index === -1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= menuLinks.length) return;

    try {
      const supabase = createClient();
      const menu1 = menuLinks[index];
      const menu2 = menuLinks[newIndex];

      await supabase
        .from('menu_links')
        .update({ position: menu2.position })
        .eq('id', menu1.id);

      await supabase
        .from('menu_links')
        .update({ position: menu1.position })
        .eq('id', menu2.id);

      toast.success('Menu berhasil dipindah');
      fetchMenuLinks();
    } catch (error) {
      console.error('Error moving menu:', error);
      toast.error('Gagal memindahkan menu');
    }
  }

  function handleEdit(item: MenuLink) {
    setEditingItem(item);
    setFormData({
      title: item.title,
      href: item.href,
      icon: item.icon || '',
      is_active: item.is_active,
    });
    setDialogOpen(true);
  }

  function resetForm() {
    setEditingItem(null);
    setFormData({
      title: '',
      href: '',
      icon: '',
      is_active: true,
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Menu Navigasi</h2>
          <p className="text-gray-500 mt-1">
            Kelola menu navigasi website
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-teal-600 hover:bg-teal-700">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Menu
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Edit Menu' : 'Tambah Menu'}
              </DialogTitle>
              <DialogDescription>
                Lengkapi form di bawah ini
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="title">Judul Menu</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Contoh: Beranda, Tentang, dll"
                />
              </div>

              <div>
                <Label htmlFor="href">Link URL</Label>
                <Input
                  id="href"
                  value={formData.href}
                  onChange={(e) => setFormData({ ...formData, href: e.target.value })}
                  placeholder="/ atau /tentang atau https://..."
                />
              </div>

              <div>
                <Label htmlFor="icon">Icon (Optional)</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="Nama icon lucide, contoh: home"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="is_active">Menu Aktif</Label>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleSubmit} className="bg-teal-600 hover:bg-teal-700">
                {editingItem ? 'Update' : 'Simpan'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Menu</CardTitle>
          <CardDescription>
            {menuLinks.length} menu item
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : menuLinks.length === 0 ? (
            <div className="text-center py-12">
              <MenuIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Belum ada menu</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Judul</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Icon</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {menuLinks.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span className="font-mono text-sm">{index + 1}</span>
                        <div className="flex flex-col ml-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveMenu(item.id, 'up')}
                            disabled={index === 0}
                            className="h-6 w-6 p-0"
                          >
                            <MoveUp className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveMenu(item.id, 'down')}
                            disabled={index === menuLinks.length - 1}
                            className="h-6 w-6 p-0"
                          >
                            <MoveDown className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell className="font-mono text-sm">{item.href}</TableCell>
                    <TableCell>{item.icon || '-'}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${
                        item.is_active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {item.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(item)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
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
    </div>
  );
}
