'use client';

import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { FileUploader } from '@/components/admin/FileUploader';
import { Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import {
  SCHOOL_PROFILE_DUMMY_CONTENT,
  getYoutubeId,
} from '@/lib/constants/school-profile';

interface SchoolProfileForm {
  profil_text: string;
  profile_highlight_quote: string;
  tag_line: string;
  quote_text: string;
  tag_line_description: string;
  youtube_video_url: string;
  video_file_url: string;
}

const defaultForm: SchoolProfileForm = SCHOOL_PROFILE_DUMMY_CONTENT;

function isMissingColumnError(error: any): boolean {
  const message = String(error?.message || '').toLowerCase();
  return (
    message.includes('column') &&
    (message.includes('does not exist') ||
      message.includes('schema cache') ||
      message.includes('could not find'))
  );
}

export default function ProfilSekolahAdminPage() {
  const supabase = createClient();

  const [recordId, setRecordId] = useState<string | null>(null);
  const [form, setForm] = useState<SchoolProfileForm>(defaultForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [legacyMode, setLegacyMode] = useState(false);

  const youtubeId = useMemo(() => getYoutubeId(form.youtube_video_url), [form.youtube_video_url]);

  useEffect(() => {
    fetchProfile();
  }, []);

  function buildModernPayload(current: SchoolProfileForm) {
    const youtubeVideoId = getYoutubeId(current.youtube_video_url);
    return {
      profil_text: current.profil_text.trim(),
      profile_highlight_quote: current.profile_highlight_quote.trim(),
      tag_line: current.tag_line.trim(),
      quote_text: current.quote_text.trim(),
      tag_line_description: current.tag_line_description.trim(),
      youtube_video_url: current.youtube_video_url.trim(),
      youtube_video_id: youtubeVideoId,
      video_file_url: current.video_file_url.trim() || null,
      is_active: true,
      updated_at: new Date().toISOString(),
    };
  }

  function buildLegacyPayload(current: SchoolProfileForm) {
    const youtubeVideoId = getYoutubeId(current.youtube_video_url);
    return {
      profil_text: current.profil_text.trim(),
      tag_line: (current.quote_text || current.tag_line).trim(),
      tag_line_description: current.tag_line_description.trim(),
      youtube_video_id: youtubeVideoId,
      is_active: true,
      updated_at: new Date().toISOString(),
    };
  }

  async function buildSeedForm(): Promise<SchoolProfileForm> {
    const { data: settingsRows } = await supabase
      .from('settings')
      .select('key, value')
      .in('key', ['school_info']);

    const schoolInfo = settingsRows?.find((item) => item.key === 'school_info')?.value || {};

    return {
      ...defaultForm,
      quote_text:
        typeof schoolInfo?.tagline === 'string' && schoolInfo.tagline.trim()
          ? schoolInfo.tagline.trim()
          : defaultForm.quote_text,
    };
  }

  async function fetchProfile() {
    try {
      // `CMS`: Ambil data section "Profil Sekolah" dari tabel `school_profile`.
      const { data, error } = await supabase
        .from('school_profile')
        .select('*')
        .eq('is_active', true)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        const seedForm = await buildSeedForm();
        let insertedId = '';

        const { data: modernInserted, error: modernInsertError } = await supabase
          .from('school_profile')
          .insert(buildModernPayload(seedForm))
          .select('id')
          .single();

        if (modernInsertError) {
          if (isMissingColumnError(modernInsertError)) {
            const { data: legacyInserted, error: legacyInsertError } = await supabase
              .from('school_profile')
              .insert(buildLegacyPayload(seedForm))
              .select('id')
              .single();

            if (legacyInsertError) throw legacyInsertError;
            insertedId = legacyInserted.id;
            setLegacyMode(true);
            toast.info('Skema lama terdeteksi. CMS berjalan dalam mode kompatibilitas.');
          } else {
            throw modernInsertError;
          }
        } else {
          insertedId = modernInserted.id;
          setLegacyMode(false);
        }

        setRecordId(insertedId);
        setForm(seedForm);
        toast.success('CMS Profil Sekolah dibuat otomatis dengan dummy konten.');
        return;
      }

      const legacyYoutubeUrl = data.youtube_video_id
        ? `https://www.youtube.com/watch?v=${data.youtube_video_id}`
        : '';
      const hasModernQuote = typeof data.quote_text === 'string';

      setRecordId(data.id);
      setForm({
        profil_text: data.profil_text || defaultForm.profil_text,
        profile_highlight_quote:
          data.profile_highlight_quote || defaultForm.profile_highlight_quote,
        tag_line: hasModernQuote ? data.tag_line || defaultForm.tag_line : defaultForm.tag_line,
        quote_text: hasModernQuote ? data.quote_text || defaultForm.quote_text : data.tag_line || defaultForm.quote_text,
        tag_line_description: data.tag_line_description || defaultForm.tag_line_description,
        youtube_video_url: data.youtube_video_url || legacyYoutubeUrl || defaultForm.youtube_video_url,
        video_file_url: data.video_file_url || defaultForm.video_file_url,
      });
      setLegacyMode(!('quote_text' in data) || !('profile_highlight_quote' in data));
    } catch (error) {
      console.error('Error fetching school profile:', error);
      toast.error('Gagal memuat data profil sekolah');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);

    try {
      if (recordId) {
        const { error } = await supabase
          .from('school_profile')
          .update(buildModernPayload(form))
          .eq('id', recordId);

        if (error) {
          if (isMissingColumnError(error)) {
            const { error: legacyError } = await supabase
              .from('school_profile')
              .update(buildLegacyPayload(form))
              .eq('id', recordId);

            if (legacyError) throw legacyError;
            setLegacyMode(true);
            toast.info('Data disimpan pada skema lama (mode kompatibilitas).');
          } else {
            throw error;
          }
        } else {
          setLegacyMode(false);
        }
      } else {
        const { data, error } = await supabase
          .from('school_profile')
          .insert(buildModernPayload(form))
          .select('id')
          .single();

        if (error) {
          if (isMissingColumnError(error)) {
            const { data: legacyData, error: legacyError } = await supabase
              .from('school_profile')
              .insert(buildLegacyPayload(form))
              .select('id')
              .single();

            if (legacyError) throw legacyError;
            setRecordId(legacyData.id);
            setLegacyMode(true);
            toast.info('Data disimpan pada skema lama (mode kompatibilitas).');
          } else {
            throw error;
          }
        } else {
          setRecordId(data.id);
          setLegacyMode(false);
        }
      }

      toast.success('Profil Sekolah berhasil disimpan');
    } catch (error) {
      console.error('Error saving school profile:', error);
      toast.error('Gagal menyimpan profil sekolah');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold tracking-tight">Profil Sekolah</h1>
        <p className="mt-1 text-gray-500">
          Kelola konten section profil yang tampil di atas halaman Visi & Misi.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>CMS Profil Sekolah</CardTitle>
          <CardDescription>
            Edit teks profil lengkap, tagline, quote, deskripsi, dan video.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
            Form ini terintegrasi ke data existing pada tabel <span className="font-semibold">school_profile</span>.
            Jika data belum ada, sistem otomatis membuat dummy content agar siap diedit.
            {legacyMode ? (
              <div className="mt-1 font-semibold text-amber-900">
                Mode kompatibilitas aktif: jalankan migration terbaru agar semua field baru tersimpan penuh.
              </div>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="profil_text">Teks Profil (2-3 paragraf)</Label>
            <Textarea
              id="profil_text"
              rows={10}
              value={form.profil_text}
              onChange={(e) => setForm((prev) => ({ ...prev, profil_text: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile_highlight_quote">Highlight Quote Profil</Label>
            <Input
              id="profile_highlight_quote"
              value={form.profile_highlight_quote}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, profile_highlight_quote: e.target.value }))
              }
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="tag_line">Judul Tagline</Label>
              <Input
                id="tag_line"
                value={form.tag_line}
                onChange={(e) => setForm((prev) => ({ ...prev, tag_line: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quote_text">Quote Tagline (italic)</Label>
              <Input
                id="quote_text"
                value={form.quote_text}
                onChange={(e) => setForm((prev) => ({ ...prev, quote_text: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tag_line_description">Deskripsi Singkat</Label>
            <Textarea
              id="tag_line_description"
              rows={4}
              value={form.tag_line_description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, tag_line_description: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="youtube_video_url">URL Video YouTube</Label>
            <Input
              id="youtube_video_url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={form.youtube_video_url}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, youtube_video_url: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Upload Video (Opsional - fallback jika tanpa YouTube)</Label>
            <FileUploader
              bucket="gallery-videos"
              accept="video/*"
              maxSize={104857600}
              multiple={false}
              preview={false}
              onUploadComplete={(url) => {
                setForm((prev) => ({ ...prev, video_file_url: url }));
                toast.success('Video berhasil diupload');
              }}
              onUploadError={(error) => {
                toast.error(error.message);
              }}
            />
            {form.video_file_url ? (
              <p className="text-xs text-slate-600 break-all">Video URL: {form.video_file_url}</p>
            ) : null}
          </div>

          {youtubeId ? (
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}`}
              title="Preview Video Profil"
              className="aspect-video w-full rounded-xl border border-slate-200 shadow"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : form.video_file_url ? (
            <video
              src={form.video_file_url}
              controls
              className="aspect-video w-full rounded-xl border border-slate-200 shadow"
            />
          ) : null}

          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setForm(defaultForm);
                toast.success('Dummy konten dimuat ke form. Klik Simpan Perubahan untuk menerapkan.');
              }}
            >
              Muat Dummy Konten
            </Button>

            <Button onClick={handleSave} disabled={saving} className="bg-teal-600 hover:bg-teal-700">
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Simpan Perubahan
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
