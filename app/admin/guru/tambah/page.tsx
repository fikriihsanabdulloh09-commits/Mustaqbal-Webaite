'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, X, User } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { CertificationManager } from '@/components/admin/CertificationManager';
import { FileUploader } from '@/components/admin/FileUploader';

export default function TambahGuruPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [certifications, setCertifications] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    full_name: '',
    nip: '',
    position: '',
    subject: '',
    education: '',
    email: '',
    phone: '',
    photo_url: '',
    bio: '',
    is_active: true,
  });

  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.full_name.trim()) {
      toast.error('Nama lengkap harus diisi');
      return;
    }

    if (!formData.position.trim()) {
      toast.error('Posisi harus diisi');
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.from('teachers').insert({
        full_name: formData.full_name,
        slug: generateSlug(formData.full_name),
        nip: formData.nip || null,
        position: formData.position,
        subject: formData.subject || null,
        education: formData.education || null,
        email: formData.email || null,
        phone: formData.phone || null,
        photo_url: formData.photo_url || null,
        bio: formData.bio || null,
        certifications: certifications.length > 0 ? certifications : null,
        is_active: formData.is_active,
        order_position: 0,
      });

      if (error) throw error;

      toast.success('Data guru berhasil ditambahkan!');
      router.push('/admin/guru');
      router.refresh();
    } catch (error: any) {
      console.error('Error creating teacher:', error);
      toast.error('Gagal menambahkan data guru');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/guru">
          <Button variant="outline" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Tambah Guru & Staff</h2>
          <p className="text-gray-500 mt-1">Tambahkan data guru atau staff baru</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Dasar</CardTitle>
              <CardDescription>Data personal guru/staff</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="full_name">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="full_name"
                    placeholder="Contoh: Drs. Ahmad Hidayat, M.Pd"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="nip">NIP</Label>
                  <Input
                    id="nip"
                    placeholder="198501012010011001"
                    value={formData.nip}
                    onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="position">
                    Posisi/Jabatan <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="position"
                    placeholder="Contoh: Kepala Sekolah, Guru, Staff"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="subject">Mata Pelajaran</Label>
                  <Input
                    id="subject"
                    placeholder="Contoh: Matematika, Fisika"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="education">Pendidikan</Label>
                <Input
                  id="education"
                  placeholder="Contoh: S1 Pendidikan Matematika, Universitas Indonesia"
                  value={formData.education}
                  onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="bio">Biografi Singkat</Label>
                <Textarea
                  id="bio"
                  placeholder="Tulis bio singkat guru..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Kontak</CardTitle>
              <CardDescription>Informasi kontak</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="guru@smkmustaqbal.sch.id"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="phone">No. Telepon</Label>
                  <Input
                    id="phone"
                    placeholder="0812-3456-7890"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Foto Profil
              </CardTitle>
              <CardDescription>Upload foto profil guru</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.photo_url && (
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <img
                      src={formData.photo_url}
                      alt="Preview"
                      className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 rounded-full h-8 w-8 p-0"
                      onClick={() => setFormData({ ...formData, photo_url: '' })}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {!formData.photo_url && (
                <FileUploader
                  bucket="teacher-photos"
                  accept="image/*"
                  maxSize={5242880}
                  onUploadComplete={(url) => setFormData({ ...formData, photo_url: url })}
                />
              )}

              {!formData.photo_url && (
                <div>
                  <Label htmlFor="photo_url">Atau masukkan URL manual</Label>
                  <Input
                    id="photo_url"
                    type="url"
                    placeholder="https://i.pravatar.cc/150?img=12"
                    value={formData.photo_url}
                    onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
                  />
                </div>
              )}

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label htmlFor="active">Status</Label>
                  <p className="text-sm text-gray-500">Guru aktif dan ditampilkan</p>
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
              <CardTitle>Sertifikat & Penghargaan</CardTitle>
              <CardDescription>Daftar sertifikat dan penghargaan yang dimiliki</CardDescription>
            </CardHeader>
            <CardContent>
              <CertificationManager
                certifications={certifications}
                onChange={setCertifications}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Link href="/admin/guru">
              <Button type="button" variant="outline">
                Batal
              </Button>
            </Link>
            <Button type="submit" className="bg-teal-600 hover:bg-teal-700" disabled={loading}>
              {loading ? 'Menyimpan...' : 'Simpan Data'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
