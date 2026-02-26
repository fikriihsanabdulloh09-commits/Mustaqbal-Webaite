'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Plus, Trash2, MoveUp, MoveDown, Edit, Eye, Layout, Palette } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface SectionType {
  id: string;
  name: string;
  display_name: string;
  description?: string;
  category: string;
  default_content: any;
  default_styles: any;
}

interface PageSection {
  id: string;
  page_path: string;
  section_type_id: string;
  section_name: string;
  order_position: number;
  content: any;
  styles: any;
  is_visible: boolean;
  section_types?: SectionType;
}

const pages = [
  { path: '/', label: 'Homepage' },
  { path: '/tentang/visi-misi', label: 'Visi & Misi' },
  { path: '/tentang/profile-guru', label: 'Profile Guru' },
  { path: '/tentang/sambutan-kepala-sekolah', label: 'Sambutan Kepala Sekolah' },
  { path: '/program', label: 'Program Keahlian' },
  { path: '/berita', label: 'Berita' },
  { path: '/galeri/foto', label: 'Galeri Foto' },
  { path: '/galeri/video', label: 'Galeri Video' },
  { path: '/ppdb', label: 'PPDB' },
  { path: '/kontak', label: 'Kontak' },
];

export default function PageBuilderPage() {
  const [selectedPage, setSelectedPage] = useState('/');
  const [sections, setSections] = useState<PageSection[]>([]);
  const [sectionTypes, setSectionTypes] = useState<SectionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSectionType, setSelectedSectionType] = useState('');

  useEffect(() => {
    fetchSectionTypes();
  }, []);

  useEffect(() => {
    if (selectedPage) {
      fetchPageSections();
    }
  }, [selectedPage]);

  async function fetchSectionTypes() {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('section_types')
        .select('*')
        .eq('is_active', true)
        .order('category');

      if (error) throw error;
      setSectionTypes(data || []);
    } catch (error) {
      console.error('Error fetching section types:', error);
      toast.error('Gagal memuat section types');
    }
  }

  async function fetchPageSections() {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('page_sections')
        .select('*, section_types(*)')
        .eq('page_path', selectedPage)
        .order('order_position');

      if (error) throw error;
      setSections(data || []);
    } catch (error) {
      console.error('Error fetching sections:', error);
      toast.error('Gagal memuat sections');
    } finally {
      setLoading(false);
    }
  }

  async function addSection() {
    if (!selectedSectionType) {
      toast.error('Pilih section type terlebih dahulu');
      return;
    }

    try {
      const supabase = createClient();
      const sectionType = sectionTypes.find(st => st.id === selectedSectionType);

      if (!sectionType) return;

      const maxPosition = sections.length > 0
        ? Math.max(...sections.map(s => s.order_position))
        : -1;

      const { data, error } = await supabase
        .from('page_sections')
        .insert({
          page_path: selectedPage,
          section_type_id: selectedSectionType,
          section_name: sectionType.display_name,
          order_position: maxPosition + 1,
          content: sectionType.default_content,
          styles: sectionType.default_styles,
          is_visible: true,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Section berhasil ditambahkan');
      setDialogOpen(false);
      setSelectedSectionType('');
      fetchPageSections();
    } catch (error) {
      console.error('Error adding section:', error);
      toast.error('Gagal menambahkan section');
    }
  }

  async function deleteSection(id: string) {
    if (!confirm('Yakin ingin menghapus section ini?')) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('page_sections')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Section berhasil dihapus');
      fetchPageSections();
    } catch (error) {
      console.error('Error deleting section:', error);
      toast.error('Gagal menghapus section');
    }
  }

  async function moveSection(id: string, direction: 'up' | 'down') {
    const index = sections.findIndex(s => s.id === id);
    if (index === -1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sections.length) return;

    try {
      const supabase = createClient();
      const section1 = sections[index];
      const section2 = sections[newIndex];

      // Swap positions
      await supabase
        .from('page_sections')
        .update({ order_position: section2.order_position })
        .eq('id', section1.id);

      await supabase
        .from('page_sections')
        .update({ order_position: section1.order_position })
        .eq('id', section2.id);

      toast.success('Section berhasil dipindah');
      fetchPageSections();
    } catch (error) {
      console.error('Error moving section:', error);
      toast.error('Gagal memindahkan section');
    }
  }

  async function toggleVisibility(id: string, currentVisibility: boolean) {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('page_sections')
        .update({ is_visible: !currentVisibility })
        .eq('id', id);

      if (error) throw error;

      toast.success(currentVisibility ? 'Section disembunyikan' : 'Section ditampilkan');
      fetchPageSections();
    } catch (error) {
      console.error('Error toggling visibility:', error);
      toast.error('Gagal mengubah visibility');
    }
  }

  const groupedSectionTypes = sectionTypes.reduce((acc, st) => {
    if (!acc[st.category]) acc[st.category] = [];
    acc[st.category].push(st);
    return acc;
  }, {} as Record<string, SectionType[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Visual Page Builder</h2>
          <p className="text-gray-500 mt-1">
            Kelola sections di setiap halaman - tambah, edit, hapus, dan atur urutan
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/themes">
            <Button variant="outline">
              <Palette className="w-4 h-4 mr-2" />
              Kelola Theme
            </Button>
          </Link>
          <Link href="/admin/styles">
            <Button variant="outline">
              <Layout className="w-4 h-4 mr-2" />
              Global Styles
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Pilih Halaman</CardTitle>
              <CardDescription>
                Pilih halaman yang ingin di-edit
              </CardDescription>
            </div>
            <Select value={selectedPage} onValueChange={setSelectedPage}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pages.map(page => (
                  <SelectItem key={page.path} value={page.path}>
                    {page.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Sections</CardTitle>
              <CardDescription>
                {sections.length} section(s) di halaman ini
              </CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-teal-600 hover:bg-teal-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Section
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Tambah Section Baru</DialogTitle>
                  <DialogDescription>
                    Pilih template section yang ingin ditambahkan
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  {Object.entries(groupedSectionTypes).map(([category, types]) => (
                    <div key={category} className="space-y-2">
                      <h4 className="font-semibold text-sm text-gray-700 uppercase tracking-wide">
                        {category}
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {types.map(type => (
                          <button
                            key={type.id}
                            onClick={() => setSelectedSectionType(type.id)}
                            className={`p-4 border-2 rounded-lg text-left transition-all hover:border-teal-500 ${
                              selectedSectionType === type.id
                                ? 'border-teal-600 bg-teal-50'
                                : 'border-gray-200'
                            }`}
                          >
                            <div className="font-medium">{type.display_name}</div>
                            <div className="text-sm text-gray-500 mt-1">
                              {type.description || 'No description'}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Batal
                  </Button>
                  <Button
                    onClick={addSection}
                    disabled={!selectedSectionType}
                    className="bg-teal-600 hover:bg-teal-700"
                  >
                    Tambah Section
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : sections.length === 0 ? (
            <div className="text-center py-12">
              <Layout className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Belum ada section di halaman ini</p>
              <p className="text-sm text-gray-400 mt-1">Klik "Tambah Section" untuk mulai</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Section Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sections.map((section, index) => (
                  <TableRow key={section.id}>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span className="font-mono text-sm">{index + 1}</span>
                        <div className="flex flex-col ml-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveSection(section.id, 'up')}
                            disabled={index === 0}
                            className="h-6 w-6 p-0"
                          >
                            <MoveUp className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveSection(section.id, 'down')}
                            disabled={index === sections.length - 1}
                            className="h-6 w-6 p-0"
                          >
                            <MoveDown className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{section.section_name}</div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-500 capitalize">
                        {section.section_types?.category || 'general'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => toggleVisibility(section.id, section.is_visible)}
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          section.is_visible
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {section.is_visible ? 'Visible' : 'Hidden'}
                      </button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/page-builder/${section.id}`}>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(selectedPage, '_blank')}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteSection(section.id)}
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

      <Card>
        <CardHeader>
          <CardTitle>Tips Penggunaan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-gray-600">
          <p>• <strong>Tambah Section</strong>: Klik tombol "Tambah Section" dan pilih template</p>
          <p>• <strong>Edit Content</strong>: Klik icon Edit untuk mengubah konten dan style section</p>
          <p>• <strong>Urutan</strong>: Gunakan panah atas/bawah untuk mengatur urutan section</p>
          <p>• <strong>Visibility</strong>: Klik status untuk show/hide section tanpa menghapus</p>
          <p>• <strong>Preview</strong>: Klik icon Eye untuk melihat halaman di tab baru</p>
          <p>• <strong>Theme</strong>: Klik "Kelola Theme" untuk mengubah warna & font global</p>
        </CardContent>
      </Card>
    </div>
  );
}
