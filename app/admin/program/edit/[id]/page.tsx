'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Plus, X, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { IconPicker } from '@/components/admin/IconPicker';
import { FileUploader } from '@/components/admin/FileUploader';

export default function EditProgramPage() {
  const router = useRouter();
  const params = useParams();
  const programId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    icon: 'GraduationCap',
    image_url: '',
    color_theme: '#0d9488',
    is_active: true,
    order_position: 0,
  });
  const [facilities, setFacilities] = useState<string[]>(['']);
  const [careers, setCareers] = useState<string[]>(['']);

  useEffect(() => {
    fetchProgram();
  }, [programId]);

  async function fetchProgram() {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from('programs').select('*').eq('id', programId).single();

      if (error) throw error;

      if (data) {
        setFormData({
          title: data.title,
          slug: data.slug,
          description: data.description || '',
          icon: data.icon || 'GraduationCap',
          image_url: data.image_url || '',
          color_theme: data.color_theme || '#0d9488',
          is_active: data.is_active ?? true,
          order_position: data.order_position || 0,
        });
        setFacilities(data.facilities?.length > 0 ? data.facilities : ['']);
        setCareers(data.career_prospects?.length > 0 ? data.career_prospects : ['']);
      }
    } catch (error) {
      console.error('Error fetching program:', error);
      toast.error('Gagal memuat data program');
      router.push('/admin/program');
    } finally {
      setLoading(false);
    }
  }

  function generateSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  function handleTitleChange(title: string) {
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    });
  }

  function addFacility() {
    setFacilities([...facilities, '']);
  }

  function updateFacility(index: number, value: string) {
    const updated = [...facilities];
    updated[index] = value;
    setFacilities(updated);
  }

  function removeFacility(index: number) {
    setFacilities(facilities.filter((_, i) => i !== index));
  }

  function addCareer() {
    setCareers([...careers, '']);
  }

  function updateCareer(index: number, value: string) {
    const updated = [...careers];
    updated[index] = value;
    setCareers(updated);
  }

  function removeCareer(index: number) {
    setCareers(careers.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Judul program harus diisi');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Deskripsi program harus diisi');
      return;
    }

    setSaving(true);

    try {
      const supabase = createClient();

      const filteredFacilities = facilities.filter((f) => f.trim() !== '');
      const filteredCareers = careers.filter((c) => c.trim() !== '');

      const { error } = await supabase
        .from('programs')
        .update({
          title: formData.title,
          slug: formData.slug,
          description: formData.description,
          icon: formData.icon,
          image_url: formData.image_url || null,
          color_theme: formData.color_theme,
          facilities: filteredFacilities,
          career_prospects: filteredCareers,
          is_active: formData.is_active,
          order_position: formData.order_position,
          updated_at: new Date().toISOString(),
        })
        .eq('id', programId);

      if (error) throw error;

      toast.success('Program berhasil diperbarui!');
      router.push('/admin/program');
      router.refresh();
    } catch (error: any) {
      console.error('Error updating program:', error);
      if (error.message?.includes('duplicate')) {
        toast.error('Slug program sudah digunakan. Ganti judul program.');
      } else {
        toast.error('Gagal memperbarui program');
      }
    } finally {
      setSaving(false);
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
      <div className="flex items-center gap-4">
        <Link href="/admin/program">
          <Button variant="outline" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Edit Program Keahlian</h2>
          <p className="text-gray-500 mt-1">Perbarui informasi program</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Dasar</CardTitle>
              <CardDescription>Detail program keahlian</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="title">
                  Nama Program <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="Contoh: Teknik Otomasi & Robotik"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  placeholder="teknik-otomasi-robotik"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-gray-500">URL: /program/{formData.slug}</p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">
                  Deskripsi <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Deskripsi lengkap program keahlian..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="color">Warna Tema</Label>
                  <div className="flex gap-2">
                    <Input
                      id="color"
                      type="color"
                      value={formData.color_theme}
                      onChange={(e) => setFormData({ ...formData, color_theme: e.target.value })}
                      className="w-20 h-10"
                    />
                    <Input
                      type="text"
                      value={formData.color_theme}
                      onChange={(e) => setFormData({ ...formData, color_theme: e.target.value })}
                      placeholder="#0d9488"
                      className="flex-1 font-mono"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="order">Urutan Tampilan</Label>
                  <Input
                    id="order"
                    type="number"
                    min="0"
                    value={formData.order_position}
                    onChange={(e) =>
                      setFormData({ ...formData, order_position: parseInt(e.target.value) })
                    }
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <IconPicker
                  value={formData.icon}
                  onChange={(icon) => setFormData({ ...formData, icon })}
                  label="Icon Program"
                  description="Pilih icon yang merepresentasikan program"
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label htmlFor="active">Status Program</Label>
                  <p className="text-sm text-gray-500">Program aktif dan ditampilkan di website</p>
                </div>
                <Switch
                  id="active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Gambar Banner Program
              </CardTitle>
              <CardDescription>Upload gambar banner untuk program (Opsional)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.image_url && (
                <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                  <img
                    src={formData.image_url}
                    alt="Banner preview"
                    className="w-full h-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => setFormData({ ...formData, image_url: '' })}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {!formData.image_url && (
                <FileUploader
                  bucket="program-icons"
                  accept="image/*"
                  maxSize={2097152}
                  onUploadComplete={(url) => setFormData({ ...formData, image_url: url })}
                />
              )}

              {!formData.image_url && (
                <div>
                  <Label htmlFor="image-url">Atau masukkan URL manual</Label>
                  <Input
                    id="image-url"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fasilitas Program</CardTitle>
              <CardDescription>Daftar fasilitas yang tersedia</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {facilities.map((facility, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Contoh: Lab Robotika dengan 20 robot kit"
                    value={facility}
                    onChange={(e) => updateFacility(index, e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeFacility(index)}
                    disabled={facilities.length === 1}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addFacility} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Fasilitas
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Prospek Karir</CardTitle>
              <CardDescription>Peluang karir lulusan program ini</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {careers.map((career, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Contoh: Automation Engineer, PLC Programmer"
                    value={career}
                    onChange={(e) => updateCareer(index, e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeCareer(index)}
                    disabled={careers.length === 1}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addCareer} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Prospek Karir
              </Button>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Link href="/admin/program">
              <Button type="button" variant="outline">
                Batal
              </Button>
            </Link>
            <Button type="submit" className="bg-teal-600 hover:bg-teal-700" disabled={saving}>
              {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
