'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface PageSection {
  id: string;
  page_path: string;
  section_type_id: string;
  section_name: string;
  order_position: number;
  content: any;
  styles: any;
  is_visible: boolean;
  animation_settings: any;
}

export default function EditSectionPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [section, setSection] = useState<PageSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [contentJSON, setContentJSON] = useState('');
  const [stylesJSON, setStylesJSON] = useState('');
  const [animationJSON, setAnimationJSON] = useState('');

  useEffect(() => {
    if (id) {
      fetchSection();
    }
  }, [id]);

  async function fetchSection() {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('page_sections')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      setSection(data);
      setContentJSON(JSON.stringify(data.content || {}, null, 2));
      setStylesJSON(JSON.stringify(data.styles || {}, null, 2));
      setAnimationJSON(JSON.stringify(data.animation_settings || {}, null, 2));
    } catch (error) {
      console.error('Error fetching section:', error);
      toast.error('Gagal memuat section');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const supabase = createClient();

      let parsedContent, parsedStyles, parsedAnimation;

      try {
        parsedContent = JSON.parse(contentJSON);
      } catch {
        toast.error('Format JSON Content tidak valid');
        setSaving(false);
        return;
      }

      try {
        parsedStyles = JSON.parse(stylesJSON);
      } catch {
        toast.error('Format JSON Styles tidak valid');
        setSaving(false);
        return;
      }

      try {
        parsedAnimation = JSON.parse(animationJSON);
      } catch {
        toast.error('Format JSON Animation tidak valid');
        setSaving(false);
        return;
      }

      const { error } = await supabase
        .from('page_sections')
        .update({
          section_name: section?.section_name,
          content: parsedContent,
          styles: parsedStyles,
          animation_settings: parsedAnimation,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      toast.success('Section berhasil disimpan');
      router.push('/admin/page-builder');
    } catch (error) {
      console.error('Error saving section:', error);
      toast.error('Gagal menyimpan section');
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

  if (!section) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-gray-500">Section tidak ditemukan</div>
          <Link href="/admin/page-builder">
            <Button className="mt-4">Kembali</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/page-builder">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Edit Section</h2>
            <p className="text-gray-500 mt-1">
              {section.page_path} - {section.section_name}
            </p>
          </div>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-teal-600 hover:bg-teal-700"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Menyimpan...' : 'Simpan Changes'}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Section Information</CardTitle>
          <CardDescription>
            Informasi dasar tentang section ini
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="section-name">Section Name</Label>
            <Input
              id="section-name"
              value={section.section_name}
              onChange={(e) =>
                setSection({ ...section, section_name: e.target.value })
              }
              placeholder="Nama section..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Page Path</Label>
              <Input value={section.page_path} disabled />
            </div>
            <div>
              <Label>Order Position</Label>
              <Input value={section.order_position} disabled />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Content (JSON)</CardTitle>
          <CardDescription>
            Konten yang akan ditampilkan di section ini (format JSON)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={contentJSON}
            onChange={(e) => setContentJSON(e.target.value)}
            placeholder='{"title": "Judul", "description": "Deskripsi"}'
            className="font-mono text-sm min-h-[300px]"
          />
          <p className="text-xs text-gray-500 mt-2">
            Contoh: &#123;&quot;title&quot;: &quot;Selamat Datang&quot;, &quot;subtitle&quot;: &quot;SMK Mustaqbal&quot;, &quot;description&quot;: &quot;Deskripsi...&quot;&#125;
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Styles (JSON)</CardTitle>
          <CardDescription>
            Custom styling untuk section ini (format JSON)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={stylesJSON}
            onChange={(e) => setStylesJSON(e.target.value)}
            placeholder='{"backgroundColor": "#fff", "padding": "4rem"}'
            className="font-mono text-sm min-h-[200px]"
          />
          <p className="text-xs text-gray-500 mt-2">
            Contoh: &#123;&quot;backgroundColor&quot;: &quot;#f0f9ff&quot;, &quot;padding&quot;: &quot;4rem 0&quot;, &quot;textAlign&quot;: &quot;center&quot;&#125;
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Animation Settings (JSON)</CardTitle>
          <CardDescription>
            Pengaturan animasi untuk section ini (format JSON)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={animationJSON}
            onChange={(e) => setAnimationJSON(e.target.value)}
            placeholder='{"type": "fade-in", "duration": 1000}'
            className="font-mono text-sm min-h-[200px]"
          />
          <p className="text-xs text-gray-500 mt-2">
            Contoh: &#123;&quot;type&quot;: &quot;fade-in&quot;, &quot;duration&quot;: 1000, &quot;delay&quot;: 0&#125;
          </p>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Link href="/admin/page-builder">
          <Button variant="outline">Batal</Button>
        </Link>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-teal-600 hover:bg-teal-700"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Menyimpan...' : 'Simpan Changes'}
        </Button>
      </div>
    </div>
  );
}
