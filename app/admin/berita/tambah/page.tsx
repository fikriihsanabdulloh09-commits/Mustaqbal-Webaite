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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, X, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { FileUploader } from '@/components/admin/FileUploader';
import { RichTextEditor } from '@/components/admin/RichTextEditor';

export default function TambahBeritaPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'artikel',
    cover_url: '',
    published_at: new Date().toISOString().split('T')[0],
    is_published: false,
    is_featured: false,
    meta_description: '',
    meta_keywords: '',
  });

  function generateSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function addTag() {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  }

  function removeTag(tagToRemove: string) {
    setTags(tags.filter(tag => tag !== tagToRemove));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.title || !formData.content) {
      toast.error('Judul dan konten wajib diisi');
      return;
    }

    setSaving(true);

    try {
      const supabase = createClient();

      const { error } = await supabase
        .from('news_articles')
        .insert([{
          ...formData,
          tags: tags.length > 0 ? tags : null,
          author: 'Admin',
          views: 0,
        }]);

      if (error) throw error;

      toast.success('Berita berhasil ditambahkan');
      router.push('/admin/berita');
    } catch (error: any) {
      console.error('Error saving article:', error);
      toast.error('Gagal menyimpan berita: ' + error.message);
    } finally {
      setSaving(false);
    }
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
          <h2 className="text-3xl font-bold tracking-tight">Tambah Berita</h2>
          <p className="text-gray-500 mt-1">
            Buat artikel berita baru dengan editor lengkap
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Cover Image Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Cover Image
            </CardTitle>
            <CardDescription>
              Upload gambar cover untuk berita (Recommended: 1200x630px)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.cover_url && (
              <div className="relative w-full h-64 rounded-lg overflow-hidden border">
                <img
                  src={formData.cover_url}
                  alt="Cover preview"
                  className="w-full h-full object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => setFormData({ ...formData, cover_url: '' })}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}

            {!formData.cover_url && (
              <FileUploader
                bucket="news-covers"
                accept="image/*"
                maxSize={5242880}
                onUploadComplete={(url) => setFormData({ ...formData, cover_url: url })}
              />
            )}

            {!formData.cover_url && (
              <div>
                <Label htmlFor="cover-url">Atau masukkan URL manual</Label>
                <Input
                  id="cover-url"
                  value={formData.cover_url}
                  onChange={(e) => setFormData({ ...formData, cover_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Informasi Dasar</CardTitle>
            <CardDescription>
              Lengkapi informasi dasar berita
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Judul Berita *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setFormData({
                    ...formData,
                    title,
                    slug: generateSlug(title),
                  });
                }}
                placeholder="Masukkan judul berita"
                required
              />
            </div>

            <div>
              <Label htmlFor="slug">URL Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="url-slug-berita"
              />
              <p className="text-xs text-gray-500 mt-1">
                Preview: /berita/{formData.slug || 'url-slug'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                    <SelectItem value="prestasi">Prestasi</SelectItem>
                    <SelectItem value="kegiatan">Kegiatan</SelectItem>
                    <SelectItem value="ppdb">PPDB</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="published-at">Tanggal Publikasi</Label>
                <Input
                  id="published-at"
                  type="date"
                  value={formData.published_at}
                  onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="excerpt">Excerpt / Ringkasan</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Tulis ringkasan singkat (maks 200 karakter)"
                rows={3}
                maxLength={200}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.excerpt.length}/200 karakter
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Content Editor */}
        <Card>
          <CardHeader>
            <CardTitle>Konten Berita *</CardTitle>
            <CardDescription>
              Tulis konten lengkap berita dengan rich text editor
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RichTextEditor
              value={formData.content}
              onChange={(value) => setFormData({ ...formData, content: value })}
              placeholder="Tulis konten berita di sini..."
            />
          </CardContent>
        </Card>

        {/* Tags */}
        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
            <CardDescription>
              Tambahkan tag untuk memudahkan pencarian
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="Ketik tag dan tekan Enter"
              />
              <Button type="button" onClick={addTag} variant="outline">
                Tambah
              </Button>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="pl-3 pr-1">
                    {tag}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-auto p-1 ml-1 hover:bg-transparent"
                      onClick={() => removeTag(tag)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* SEO Settings */}
        <Card>
          <CardHeader>
            <CardTitle>SEO Settings</CardTitle>
            <CardDescription>
              Optimasi untuk mesin pencari
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="meta-description">Meta Description</Label>
              <Textarea
                id="meta-description"
                value={formData.meta_description}
                onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                placeholder="Deskripsi singkat untuk search engine"
                rows={2}
                maxLength={160}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.meta_description.length}/160 karakter
              </p>
            </div>

            <div>
              <Label htmlFor="meta-keywords">Meta Keywords</Label>
              <Input
                id="meta-keywords"
                value={formData.meta_keywords}
                onChange={(e) => setFormData({ ...formData, meta_keywords: e.target.value })}
                placeholder="kata kunci, dipisahkan, dengan, koma"
              />
            </div>
          </CardContent>
        </Card>

        {/* Publishing Options */}
        <Card>
          <CardHeader>
            <CardTitle>Opsi Publikasi</CardTitle>
            <CardDescription>
              Atur status dan visibilitas berita
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <Label htmlFor="is-published" className="cursor-pointer">Publikasikan Berita</Label>
                <p className="text-sm text-gray-500">Berita akan terlihat di website</p>
              </div>
              <Switch
                id="is-published"
                checked={formData.is_published}
                onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <Label htmlFor="is-featured" className="cursor-pointer">Berita Unggulan</Label>
                <p className="text-sm text-gray-500">Tampilkan di homepage</p>
              </div>
              <Switch
                id="is-featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end sticky bottom-4 bg-white p-4 rounded-lg border shadow-lg">
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
            {saving ? 'Menyimpan...' : 'Simpan Berita'}
          </Button>
        </div>
      </form>
    </div>
  );
}
