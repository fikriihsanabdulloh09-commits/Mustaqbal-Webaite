'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { FileUploader } from '@/components/admin/FileUploader';

const RichTextEditor = dynamic(
  () => import('@/components/admin/RichTextEditor').then((mod) => mod.RichTextEditor),
  {
    ssr: false,
    loading: () => <p>Loading editor...</p>,
  }
);

export default function EditBeritaPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'artikel',
    cover_url: '',
    is_published: false,
    is_featured: false,
  });

  useEffect(() => {
    if (id) {
      fetchArticle();
    }
  }, [id]);

  async function fetchArticle() {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      setFormData({
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        category: data.category || 'artikel',
        cover_url: data.cover_url || '',
        is_published: data.is_published,
        is_featured: data.is_featured || false,
      });
    } catch (error) {
      console.error('Error fetching article:', error);
      toast.error('Gagal memuat berita');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const supabase = createClient();

      const { error } = await supabase
        .from('news_articles')
        .update({
          ...formData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      toast.success('Berita berhasil diupdate');
      router.push('/admin/berita');
    } catch (error) {
      console.error('Error updating article:', error);
      toast.error('Gagal mengupdate berita');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/berita">
          <Button variant="outline" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Edit Berita</h2>
          <p className="text-gray-500 mt-1">
            Edit artikel berita
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informasi Berita</CardTitle>
            <CardDescription>
              Edit informasi berita
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Judul Berita</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Masukkan judul berita..."
                required
              />
            </div>

            <div>
              <Label htmlFor="slug">Slug URL</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="slug-url-berita"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                URL berita: /berita/{formData.slug}
              </p>
            </div>

            <div>
              <Label htmlFor="category">Kategori</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="artikel">Artikel</SelectItem>
                  <SelectItem value="pengumuman">Pengumuman</SelectItem>
                  <SelectItem value="berita">Berita</SelectItem>
                  <SelectItem value="kegiatan">Kegiatan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="cover_url">Gambar Cover</Label>
              {formData.cover_url ? (
                <div className="mt-2">
                  <img
                    src={formData.cover_url}
                    alt="Cover preview"
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setFormData({ ...formData, cover_url: '' })}
                    className="mt-2 text-red-600 hover:text-red-700"
                  >
                    Ganti Gambar
                  </Button>
                </div>
              ) : (
                <FileUploader
                  bucket="news-covers"
                  accept="image/*"
                  maxSize={5242880}
                  onUploadComplete={(url) => setFormData({ ...formData, cover_url: url })}
                  preview
                />
              )}
            </div>

            <div>
              <Label htmlFor="excerpt">Ringkasan</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Ringkasan singkat berita..."
                rows={3}
                required
              />
            </div>

            <div>
              <Label htmlFor="content">Konten Berita</Label>
              <RichTextEditor
                value={formData.content}
                onChange={(value) => setFormData({ ...formData, content: value })}
                placeholder="Tulis konten berita lengkap di sini..."
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pengaturan Publikasi</CardTitle>
            <CardDescription>
              Atur status publikasi berita
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_published"
                checked={formData.is_published}
                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="is_published">Publikasikan Berita</Label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_featured"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="is_featured">Jadikan Berita Unggulan</Label>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Link href="/admin/berita">
            <Button type="button" variant="outline">
              Batal
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={saving}
            className="bg-teal-600 hover:bg-teal-700"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Button>
        </div>
      </form>
    </div>
  );
}
