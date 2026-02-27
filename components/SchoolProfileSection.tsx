'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
  SCHOOL_PROFILE_DUMMY_CONTENT,
  getYoutubeId,
} from '@/lib/constants/school-profile';

export interface SchoolProfileSectionData {
  profil_text: string;
  profile_highlight_quote: string;
  tag_line: string;
  quote_text: string;
  tag_line_description: string;
  youtube_video_url: string;
  video_file_url?: string | null;
}

interface SchoolProfileSectionProps {
  data?: Partial<SchoolProfileSectionData>;
  className?: string;
}

const DEFAULT_DATA: SchoolProfileSectionData = SCHOOL_PROFILE_DUMMY_CONTENT;

export default function SchoolProfileSection({ data, className = '' }: SchoolProfileSectionProps) {
  const [content, setContent] = useState<SchoolProfileSectionData>({ ...DEFAULT_DATA, ...data });

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      // `CMS`: Section ini mengambil data dari tabel Supabase `school_profile`.
      const { data: row, error } = await supabase
        .from('school_profile')
        .select('*')
        .eq('is_active', true)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error || !row || !mounted) return;

      const legacyYoutubeUrl = row.youtube_video_id
        ? `https://www.youtube.com/watch?v=${row.youtube_video_id}`
        : '';
      const hasModernQuote = typeof row.quote_text === 'string';

      setContent((prev) => ({
        ...prev,
        profil_text: row.profil_text || prev.profil_text,
        profile_highlight_quote:
          row.profile_highlight_quote || prev.profile_highlight_quote,
        tag_line: hasModernQuote ? row.tag_line || prev.tag_line : prev.tag_line,
        quote_text: hasModernQuote ? row.quote_text || prev.quote_text : row.tag_line || prev.quote_text,
        tag_line_description: row.tag_line_description || prev.tag_line_description,
        youtube_video_url: row.youtube_video_url || legacyYoutubeUrl || prev.youtube_video_url,
        video_file_url: row.video_file_url || prev.video_file_url || '',
      }));
    }

    loadProfile();
    return () => {
      mounted = false;
    };
  }, []);

  const profileParagraphs = useMemo(() => {
    const paragraphs = content.profil_text
      .split(/\n{2,}/)
      .map((item) => item.trim())
      .filter(Boolean);

    return paragraphs.slice(0, 3);
  }, [content.profil_text]);

  const youtubeId = useMemo(() => getYoutubeId(content.youtube_video_url), [content.youtube_video_url]);

  return (
    <section className={`bg-white py-12 md:py-16 ${className}`}>
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <h2 className="mb-8 text-3xl font-bold text-teal-900 md:text-4xl">Profil Sekolah</h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
          <div className="space-y-5">
            <h3 className="text-2xl font-bold text-slate-900 md:text-3xl">Profil</h3>

            <div className="space-y-4 text-sm leading-7 text-slate-700 md:text-base">
              {profileParagraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}

              <blockquote className="rounded-xl border-l-4 border-teal-600 bg-teal-50 px-4 py-3 italic text-teal-900">
                "{content.profile_highlight_quote}"
              </blockquote>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-teal-100 bg-gradient-to-br from-teal-50 to-emerald-50 p-6">
              <h3 className="text-xl font-bold text-teal-900">{content.tag_line || 'Tag Line'}</h3>
              <p className="mt-3 text-lg italic text-slate-800">"{content.quote_text}"</p>
              <p className="mt-3 text-sm leading-6 text-slate-600 md:text-base">
                {content.tag_line_description}
              </p>
            </div>

            {youtubeId ? (
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}`}
                title="Video Profil Sekolah"
                className="aspect-video w-full rounded-xl border border-teal-100 shadow-lg"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : content.video_file_url ? (
              <video
                src={content.video_file_url}
                controls
                className="aspect-video w-full rounded-xl border border-teal-100 shadow-lg"
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
