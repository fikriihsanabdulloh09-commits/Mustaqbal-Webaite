'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Search, MoreHorizontal, Pencil, Trash2, User } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface Teacher {
  id: string;
  full_name: string;
  nip?: string;
  position: string;
  subject?: string;
  photo_url?: string;
  education?: string;
  email?: string;
  phone?: string;
  is_active: boolean;
  created_at: string;
}

export default function GuruPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; teacher: Teacher | null }>({
    open: false,
    teacher: null,
  });

  useEffect(() => {
    fetchTeachers();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredTeachers(teachers);
    } else {
      const filtered = teachers.filter(
        (teacher) =>
          teacher.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          teacher.position?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          teacher.subject?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTeachers(filtered);
    }
  }, [searchQuery, teachers]);

  async function fetchTeachers() {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .order('order_position', { ascending: true });

      if (error) throw error;
      setTeachers(data || []);
      setFilteredTeachers(data || []);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      toast.error('Gagal memuat data guru');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(teacher: Teacher) {
    try {
      const supabase = createClient();
      const { error } = await supabase.from('teachers').delete().eq('id', teacher.id);
      if (error) throw error;
      toast.success('Data guru berhasil dihapus');
      setDeleteDialog({ open: false, teacher: null });
      fetchTeachers();
    } catch (error) {
      console.error('Error deleting teacher:', error);
      toast.error('Gagal menghapus data guru');
    }
  }

  async function toggleActive(id: string, currentStatus: boolean) {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('teachers')
        .update({ is_active: !currentStatus })
        .eq('id', id);
      if (error) throw error;
      toast.success(currentStatus ? 'Guru dinonaktifkan' : 'Guru diaktifkan');
      fetchTeachers();
    } catch (error) {
      console.error('Error toggling active:', error);
      toast.error('Gagal mengubah status');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Manajemen Guru & Staff</h2>
          <p className="text-gray-500 mt-1">Kelola data guru dan staff sekolah</p>
        </div>
        <Link href="/admin/guru/tambah">
          <Button className="bg-teal-600 hover:bg-teal-700">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Guru
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Daftar Guru & Staff</CardTitle>
              <CardDescription>
                {filteredTeachers.length} dari {teachers.length} guru
              </CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Cari guru..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Posisi</TableHead>
                <TableHead>Mata Pelajaran</TableHead>
                <TableHead>Kontak</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTeachers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    {searchQuery ? 'Tidak ada guru yang cocok' : 'Belum ada data guru'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredTeachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {teacher.photo_url ? (
                          <img
                            src={teacher.photo_url}
                            alt={teacher.full_name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                            <User className="w-6 h-6 text-teal-600" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{teacher.full_name}</div>
                          {teacher.nip && <div className="text-sm text-gray-500">NIP: {teacher.nip}</div>}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {teacher.position}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{teacher.subject || '-'}</span>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {teacher.email && <div>{teacher.email}</div>}
                        {teacher.phone && <div className="text-gray-500">{teacher.phone}</div>}
                      </div>
                    </TableCell>
                    <TableCell>
                      {teacher.is_active ? (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Aktif</Badge>
                      ) : (
                        <Badge variant="secondary">Nonaktif</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/guru/edit/${teacher.id}`}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleActive(teacher.id, teacher.is_active)}>
                            {teacher.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => setDeleteDialog({ open: true, teacher })}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, teacher: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Data Guru</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus <strong>{deleteDialog.teacher?.full_name}</strong>?
              Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false, teacher: null })}>
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteDialog.teacher && handleDelete(deleteDialog.teacher)}
            >
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
