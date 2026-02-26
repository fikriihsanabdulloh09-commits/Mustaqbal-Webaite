'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus, Search, MoreHorizontal, Pencil, Trash2, Eye, ArrowUp, ArrowDown } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface Program {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  image_url?: string;
  color_theme: string;
  facilities: any[];
  career_prospects: any[];
  is_active: boolean;
  order_position: number;
  created_at: string;
}

export default function ProgramPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; program: Program | null }>({
    open: false,
    program: null,
  });

  useEffect(() => {
    fetchPrograms();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPrograms(programs);
    } else {
      const filtered = programs.filter(
        (program) =>
          program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          program.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPrograms(filtered);
    }
  }, [searchQuery, programs]);

  async function fetchPrograms() {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .order('order_position', { ascending: true });

      if (error) throw error;

      setPrograms(data || []);
      setFilteredPrograms(data || []);
    } catch (error) {
      console.error('Error fetching programs:', error);
      toast.error('Gagal memuat data program');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(program: Program) {
    try {
      const supabase = createClient();
      const { error } = await supabase.from('programs').delete().eq('id', program.id);

      if (error) throw error;

      toast.success('Program berhasil dihapus');
      setDeleteDialog({ open: false, program: null });
      fetchPrograms();
    } catch (error) {
      console.error('Error deleting program:', error);
      toast.error('Gagal menghapus program');
    }
  }

  async function toggleActive(id: string, currentStatus: boolean) {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('programs')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast.success(currentStatus ? 'Program dinonaktifkan' : 'Program diaktifkan');
      fetchPrograms();
    } catch (error) {
      console.error('Error toggling active:', error);
      toast.error('Gagal mengubah status program');
    }
  }

  async function moveProgram(program: Program, direction: 'up' | 'down') {
    try {
      const currentIndex = programs.findIndex((p) => p.id === program.id);
      if (
        (direction === 'up' && currentIndex === 0) ||
        (direction === 'down' && currentIndex === programs.length - 1)
      ) {
        return;
      }

      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      const targetProgram = programs[targetIndex];

      const supabase = createClient();

      await supabase
        .from('programs')
        .update({ order_position: targetProgram.order_position })
        .eq('id', program.id);

      await supabase
        .from('programs')
        .update({ order_position: program.order_position })
        .eq('id', targetProgram.id);

      toast.success('Urutan program diperbarui');
      fetchPrograms();
    } catch (error) {
      console.error('Error moving program:', error);
      toast.error('Gagal mengubah urutan program');
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
          <h2 className="text-3xl font-bold tracking-tight">Manajemen Program Keahlian</h2>
          <p className="text-gray-500 mt-1">Kelola program keahlian dan jurusan sekolah</p>
        </div>
        <Link href="/admin/program/tambah">
          <Button className="bg-teal-600 hover:bg-teal-700">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Program
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Daftar Program Keahlian</CardTitle>
              <CardDescription>
                {filteredPrograms.length} dari {programs.length} program
              </CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Cari program..."
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
                <TableHead className="w-16">Urutan</TableHead>
                <TableHead>Nama Program</TableHead>
                <TableHead>Fasilitas</TableHead>
                <TableHead>Karir</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPrograms.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    {searchQuery ? 'Tidak ada program yang cocok' : 'Belum ada program'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredPrograms.map((program, index) => (
                  <TableRow key={program.id}>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveProgram(program, 'up')}
                          disabled={index === 0}
                        >
                          <ArrowUp className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveProgram(program, 'down')}
                          disabled={index === filteredPrograms.length - 1}
                        >
                          <ArrowDown className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: program.color_theme || '#0d9488' }}
                        >
                          {program.title.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium">{program.title}</div>
                          <div className="text-sm text-gray-500 line-clamp-1">{program.description}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {program.facilities?.length || 0} item
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {program.career_prospects?.length || 0} karir
                      </span>
                    </TableCell>
                    <TableCell>
                      {program.is_active ? (
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
                            <Link href={`/program/${program.slug}`} target="_blank">
                              <Eye className="mr-2 h-4 w-4" />
                              Lihat
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/program/edit/${program.id}`}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleActive(program.id, program.is_active)}>
                            {program.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => setDeleteDialog({ open: true, program })}
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

      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, program: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Program</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus program <strong>{deleteDialog.program?.title}</strong>?
              Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false, program: null })}>
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteDialog.program && handleDelete(deleteDialog.program)}
            >
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
