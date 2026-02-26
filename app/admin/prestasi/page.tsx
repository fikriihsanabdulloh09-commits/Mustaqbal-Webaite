'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { Plus, Trash2, Edit, Award } from 'lucide-react';
import { toast } from 'sonner';

interface Achievement {
  id: string;
  title: string;
  description?: string;
  student_name?: string;
  category?: string;
  level?: string;
  rank?: string;
  year?: number;
  is_featured: boolean;
  created_at: string;
}

export default function PrestasiPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Achievement | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    student_name: '',
    category: '',
    level: '',
    rank: '',
    year: new Date().getFullYear(),
    is_featured: false,
  });

  useEffect(() => {
    fetchAchievements();
  }, []);

  async function fetchAchievements() {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .order('year', { ascending: false });

      if (error) throw error;
      setAchievements(data || []);
    } catch (error) {
      console.error('Error fetching achievements:', error);
      toast.error('Gagal memuat prestasi');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit() {
    try {
      const supabase = createClient();

      if (editingItem) {
        const { error } = await supabase
          .from('achievements')
          .update(formData)
          .eq('id', editingItem.id);

        if (error) throw error;
        toast.success('Prestasi berhasil diupdate');
      } else {
        const { error } = await supabase
          .from('achievements')
          .insert([formData]);

        if (error) throw error;
        toast.success('Prestasi berhasil ditambahkan');
      }

      setDialogOpen(false);
      resetForm();
      fetchAchievements();
    } catch (error) {
      console.error('Error saving achievement:', error);
      toast.error('Gagal menyimpan prestasi');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Yakin ingin menghapus prestasi ini?')) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('achievements')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Prestasi berhasil dihapus');
      fetchAchievements();
    } catch (error) {
      console.error('Error deleting achievement:', error);
      toast.error('Gagal menghapus prestasi');
    }
  }

  function handleEdit(item: Achievement) {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || '',
      student_name: item.student_name || '',
      category: item.category || '',
      level: item.level || '',
      rank: item.rank || '',
      year: item.year || new Date().getFullYear(),
      is_featured: item.is_featured,
    });
    setDialogOpen(true);
  }

  function resetForm() {
    setEditingItem(null);
    setFormData({
      title: '',
      description: '',
      student_name: '',
      category: '',
      level: '',
      rank: '',
      year: new Date().getFullYear(),
      is_featured: false,
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Prestasi</h2>
          <p className="text-gray-500 mt-1">
            Kelola prestasi siswa dan sekolah
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-teal-600 hover:bg-teal-700">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Prestasi
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Edit Prestasi' : 'Tambah Prestasi'}
              </DialogTitle>
              <DialogDescription>
                Lengkapi form di bawah ini
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="title">Judul Prestasi</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Contoh: Juara 1 Lomba Robotika..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="student_name">Nama Siswa</Label>
                  <Input
                    id="student_name"
                    value={formData.student_name}
                    onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
                    placeholder="Nama siswa..."
                  />
                </div>

                <div>
                  <Label htmlFor="year">Tahun</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="category">Kategori</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Akademik, Olahraga, dll"
                  />
                </div>

                <div>
                  <Label htmlFor="level">Tingkat</Label>
                  <Input
                    id="level"
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    placeholder="Kota, Provinsi, Nasional"
                  />
                </div>

                <div>
                  <Label htmlFor="rank">Peringkat</Label>
                  <Input
                    id="rank"
                    value={formData.rank}
                    onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
                    placeholder="Juara 1, 2, 3, dll"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Deskripsi prestasi..."
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
                <Label htmlFor="is_featured">Prestasi Unggulan</Label>
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
          <CardTitle>Daftar Prestasi</CardTitle>
          <CardDescription>
            {achievements.length} prestasi tercatat
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : achievements.length === 0 ? (
            <div className="text-center py-12">
              <Award className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Belum ada prestasi</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Judul</TableHead>
                  <TableHead>Siswa</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Tingkat</TableHead>
                  <TableHead>Peringkat</TableHead>
                  <TableHead>Tahun</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {achievements.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {item.title}
                      {item.is_featured && (
                        <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs">
                          Featured
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{item.student_name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.level}</TableCell>
                    <TableCell>{item.rank}</TableCell>
                    <TableCell>{item.year}</TableCell>
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
