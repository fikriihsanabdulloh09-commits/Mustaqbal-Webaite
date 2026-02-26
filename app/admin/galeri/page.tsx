'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { Plus, Trash2, Edit, Image as ImageIcon, Video } from 'lucide-react';
import { toast } from 'sonner';

interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  media_type: string;
  media_url: string;
  thumbnail_url?: string;
  category?: string;
  is_featured: boolean;
  created_at: string;
}

export default function GaleriPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    media_type: 'foto',
    media_url: '',
    thumbnail_url: '',
    category: 'umum',
    is_featured: false,
  });

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('gallery_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching gallery items:', error);
      toast.error('Gagal memuat galeri');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit() {
    try {
      const supabase = createClient();

      if (editingItem) {
        const { error } = await supabase
          .from('gallery_items')
          .update(formData)
          .eq('id', editingItem.id);

        if (error) throw error;
        toast.success('Item berhasil diupdate');
      } else {
        const { error } = await supabase
          .from('gallery_items')
          .insert([formData]);

        if (error) throw error;
        toast.success('Item berhasil ditambahkan');
      }

      setDialogOpen(false);
      resetForm();
      fetchItems();
    } catch (error) {
      console.error('Error saving gallery item:', error);
      toast.error('Gagal menyimpan item');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Yakin ingin menghapus item ini?')) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('gallery_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Item berhasil dihapus');
      fetchItems();
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      toast.error('Gagal menghapus item');
    }
  }

  function handleEdit(item: GalleryItem) {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || '',
      media_type: item.media_type,
      media_url: item.media_url,
      thumbnail_url: item.thumbnail_url || '',
      category: item.category || 'umum',
      is_featured: item.is_featured,
    });
    setDialogOpen(true);
  }

  function resetForm() {
    setEditingItem(null);
    setFormData({
      title: '',
      description: '',
      media_type: 'foto',
      media_url: '',
      thumbnail_url: '',
      category: 'umum',
      is_featured: false,
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Galeri</h2>
          <p className="text-gray-500 mt-1">
            Kelola foto dan video galeri
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-teal-600 hover:bg-teal-700">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Edit Item' : 'Tambah Item Galeri'}
              </DialogTitle>
              <DialogDescription>
                Lengkapi form di bawah ini
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="title">Judul</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Judul item..."
                />
              </div>

              <div>
                <Label htmlFor="media_type">Tipe Media</Label>
                <Select
                  value={formData.media_type}
                  onValueChange={(value) => setFormData({ ...formData, media_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="foto">Foto</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="media_url">URL Media</Label>
                <Input
                  id="media_url"
                  value={formData.media_url}
                  onChange={(e) => setFormData({ ...formData, media_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div>
                <Label htmlFor="thumbnail_url">URL Thumbnail (Optional)</Label>
                <Input
                  id="thumbnail_url"
                  value={formData.thumbnail_url}
                  onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div>
                <Label htmlFor="category">Kategori</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Kategori..."
                />
              </div>

              <div>
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Deskripsi..."
                  rows={4}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_featured"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="is_featured">Item Unggulan</Label>
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
          <CardTitle>Daftar Galeri</CardTitle>
          <CardDescription>
            {items.length} item di galeri
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : items.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Belum ada item di galeri</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Preview</TableHead>
                  <TableHead>Judul</TableHead>
                  <TableHead>Tipe</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {item.media_type === 'foto' ? (
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                      ) : (
                        <Video className="w-8 h-8 text-gray-400" />
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell className="capitalize">{item.media_type}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>
                      {item.is_featured && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">
                          Featured
                        </span>
                      )}
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
